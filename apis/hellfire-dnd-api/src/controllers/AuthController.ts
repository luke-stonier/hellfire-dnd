import { Request, Response, Application } from "express";
import { Service } from "typedi";
import { ENVIRONMENT } from "../environment";
import { OK, STATUSRESP } from "../helpers/ActionResults";
import IController from "../interfaces/IController";
import { requireAuth } from "../middleware/auth/RequireAuth";
import { signAccessToken } from "../middleware/auth/jwt";
import { User } from "../Entities/User";
import UserContext from "../contexts/UserContext";

type RegisterBody = {
    email: string;
    password: string;
    displayName: string;
    role?: "DM" | "PLAYER";
};

type LoginBody = {
    email: string;
    password: string;
};

@Service()
export default class AuthController implements IController {
    constructor(private userContext: UserContext) {}

    RegisterEndpoint(app: Application): void {
        app.post(`${ENVIRONMENT.API_ROUTE}/auth/register`, async (req, res) => this.register(req, res));
        app.post(`${ENVIRONMENT.API_ROUTE}/auth/login`, async (req, res) => this.login(req, res));
        app.get(`${ENVIRONMENT.API_ROUTE}/auth/me`, requireAuth, async (req, res) => this.me(req, res));
    }

    private async register(req: Request, res: Response): Promise<void> {
        const body = (req.body ?? {}) as RegisterBody;

        const email = (body.email ?? "").trim().toLowerCase();
        const password = body.password ?? "";
        const displayName = (body.displayName ?? "").trim();

        if (!email || !password || !displayName) {
            return STATUSRESP(res, 400, { ok: false, error: "email, password, displayName are required" });
        }
        if (password.length < 8) {
            return STATUSRESP(res, 400, { ok: false, error: "Password must be at least 8 characters" });
        }

        const existing = await this.userContext.FindByEmail(email);
        if (existing) {
            return STATUSRESP(res, 409, { ok: false, error: "Email already in use" });
        }

        const user = new User();
        user.email = email;
        user.displayName = displayName;
        user.role = body.role ?? "PLAYER";
        await user.setPassword(password);

        // Assuming DatabaseUtil has a save/create method; fallback to repo.save
        const saved = await (this.userContext as any).repo.save(user);

        const token = signAccessToken({ userId: saved.id, role: saved.role });
        return OK(res, { user: saved.toSafeJSON(), token });
    }

    private async login(req: Request, res: Response): Promise<void> {
        const body = (req.body ?? {}) as LoginBody;

        const email = (body.email ?? "").trim().toLowerCase();
        const password = body.password ?? "";

        if (!email || !password) {
            return STATUSRESP(res, 400, { ok: false, error: "Email and password are required" });
        }

        const user = await this.userContext.FindByEmail(email);

        if (!user || !user.isActive) {
            return STATUSRESP(res, 401, { ok: false, error: "Invalid credentials" });
        }

        const valid = await user.verifyPassword(password);
        if (!valid) {
            return STATUSRESP(res, 401, { ok: false, error: "Invalid credentials" });
        }

        const token = signAccessToken({ userId: user.id, role: user.role });
        return OK(res, { user: user.toSafeJSON(), token });
    }

    private async me(req: Request, res: Response): Promise<void> {
        const auth = req.auth;
        if (!auth?.userId) {
            return STATUSRESP(res, 401, { ok: false, error: "Unauthorized" });
        }

        const user = await this.userContext.FindActiveById(auth.userId);
        if (!user) {
            return STATUSRESP(res, 401, { ok: false, error: "Unauthorized" });
        }

        return OK(res, { user: user.toSafeJSON() });
    }
}
