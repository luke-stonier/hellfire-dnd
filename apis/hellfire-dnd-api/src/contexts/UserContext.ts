import { Service } from "typedi";
import { DatabaseUtil } from "../DatabaseUtil";
import DatabaseService from "../services/DatabaseService";
import IContext from "./IContext";
import { User } from "../Entities/User";

@Service()
export default class UserContext extends DatabaseUtil<User> implements IContext {
    constructor(private databaseService: DatabaseService) {
        super(databaseService.postgresSource.getRepository(User));
    }

    /**
     * Find a user by email (normalized)
     */
    async FindByEmail(email: string): Promise<User | null> {
        const normalized = (email ?? "").trim().toLowerCase();
        return this.SingleOrDefault<User>({ where: { email: normalized } });
    }

    /**
     * Find an active user by id
     */
    async FindActiveById(id: string): Promise<User | null> {
        return this.SingleOrDefault<User>({ where: { id, isActive: true } });
    }

    /**
     * Create/save a new user (just wraps DatabaseUtil.Save for clarity at call sites)
     */
    async Create(user: User): Promise<User> {
        return this.Save<User>(user);
    }
}
