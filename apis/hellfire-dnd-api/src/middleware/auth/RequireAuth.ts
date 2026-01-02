import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, AuthTokenPayload } from "./jwt";

declare global {
    namespace Express {
        interface Request {
            auth?: AuthTokenPayload;
        }
    }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

    if (!token) {
        res.status(401).json({ ok: false, error: "Missing Authorization header" });
        return;
    }

    try {
        req.auth = verifyAccessToken(token);
        next();
    } catch {
        res.status(401).json({ ok: false, error: "Invalid or expired token" });
    }
}


export function requireRole(...roles: Array<"DM" | "PLAYER" | "ADMIN">) {
    return (req: Request, res: Response, next: NextFunction) => {
        const role = req.auth?.role;
        if (!role || !roles.includes(role)) {
            return res.status(403).json({ ok: false, error: "Forbidden" });
        }
        next();
    };
}
