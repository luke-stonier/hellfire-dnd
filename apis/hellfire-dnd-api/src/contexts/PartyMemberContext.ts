import { Service } from "typedi";
import { DatabaseUtil } from "../DatabaseUtil";
import DatabaseService from "../services/DatabaseService";
import IContext from "./IContext";
import { PartyMember } from "../Entities/PartyMember";

@Service()
export default class PartyMemberContext extends DatabaseUtil<PartyMember> implements IContext {
    constructor(private databaseService: DatabaseService) {
        super(databaseService.postgresSource.getRepository(PartyMember));
    }

    async FindMembership(partyId: string, userId: string): Promise<PartyMember | null> {
        return this.SingleOrDefault<PartyMember>({
            where: { partyId, userId, isActive: true },
        });
    }

    async ListMembers(partyId: string): Promise<PartyMember[]> {
        return this.Where<PartyMember>({
            where: { partyId, isActive: true },
            order: { createdAt: "ASC" as any },
        });
    }
}
