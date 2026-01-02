import { Service } from "typedi";
import { DatabaseUtil } from "../DatabaseUtil";
import DatabaseService from "../services/DatabaseService";
import IContext from "./IContext";
import { Party } from "../Entities/Party";

@Service()
export default class PartyContext extends DatabaseUtil<Party> implements IContext {
    constructor(private databaseService: DatabaseService) {
        super(databaseService.postgresSource.getRepository(Party));
    }

    async FindById(id: string): Promise<Party | null> {
        return this.SingleOrDefault<Party>({ where: { id, isActive: true } });
    }

    async FindByInviteCode(inviteCode: string): Promise<Party | null> {
        return this.SingleOrDefault<Party>({
            where: { inviteCode: (inviteCode ?? "").trim().toUpperCase(), isActive: true },
        });
    }

    async ListForDM(dmUserId: string): Promise<Party[]> {
        return this.Where<Party>({
            where: { dmUserId, isActive: true },
            order: { createdAt: "DESC" as any },
        });
    }
}
