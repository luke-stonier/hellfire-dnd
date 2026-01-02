import { Request, Response, Application } from "express";
import { Service } from "typedi";
import { ENVIRONMENT } from "../environment";
import { OK, STATUSRESP } from "../helpers/ActionResults";
import IController from "../interfaces/IController";
import { requireAuth } from "../middleware/auth/RequireAuth";
import { requirePartyMember } from "../middleware/auth/RequirePartyMember";
import PartyContext from "../contexts/PartyContext";
import PartyMemberContext from "../contexts/PartyMemberContext";
import { Party } from "../Entities/Party";
import { PartyMember } from "../Entities/PartyMember";

type CreatePartyBody = {
    name: string;
    description?: string;
};

type JoinPartyBody = {
    inviteCode: string;
    characterName?: string;
};

@Service()
export default class PartyController implements IController {
    constructor(
        private partyContext: PartyContext,
        private partyMemberContext: PartyMemberContext
    ) {}

    RegisterEndpoint(app: Application): void {
        app.post(`${ENVIRONMENT.API_ROUTE}/parties`, requireAuth, async (req, res) => this.createParty(req, res));
        app.get(`${ENVIRONMENT.API_ROUTE}/parties`, requireAuth, async (req, res) => this.listMyParties(req, res));

        app.get(
            `${ENVIRONMENT.API_ROUTE}/parties/:partyId`,
            requireAuth,
            requirePartyMember("partyId"),
            async (req, res) => this.getParty(req, res)
        );

        app.post(`${ENVIRONMENT.API_ROUTE}/parties/join`, requireAuth, async (req, res) => this.joinParty(req, res));
    }

    private async createParty(req: Request, res: Response): Promise<void> {
        const userId = req.auth?.userId;
        if (!userId) return STATUSRESP(res, 401, { ok: false, error: "Unauthorized" });

        const body = (req.body ?? {}) as CreatePartyBody;
        const name = (body.name ?? "").trim();
        const description = (body.description ?? "").trim();

        if (!name) return STATUSRESP(res, 400, { ok: false, error: "Party name is required" });

        const party = new Party();
        party.name = name;
        party.description = description || null;
        party.dmUserId = userId;

        // Save party (inviteCode auto-generated in BeforeInsert)
        const created = await this.partyContext.Save<Party>(party);

        // Add creator as DM member
        const member = new PartyMember();
        member.partyId = created.id;
        member.userId = userId;
        member.partyRole = "DM";
        member.characterName = null;

        await this.partyMemberContext.Save<PartyMember>(member);

        return OK(res, { party: created.toSafeJSON() });
    }

    private async listMyParties(req: Request, res: Response): Promise<void> {
        const userId = req.auth?.userId;
        if (!userId) return STATUSRESP(res, 401, { ok: false, error: "Unauthorized" });

        // Get memberships, then fetch parties
        const memberships = await this.partyMemberContext.Where<PartyMember>({
            where: { userId, isActive: true },
            order: { createdAt: "DESC" as any },
        });

        const partyIds = memberships.map(m => m.partyId);
        if (partyIds.length === 0) return OK(res, { parties: [] });

        const parties = await this.partyContext.Where<Party>({
            where: { id: (partyIds as any), isActive: true } as any, // TypeORM In() would be nicer, but keeping minimal
        });

        // Preserve membership order (optional)
        const map = new Map(parties.map(p => [p.id, p]));
        const ordered = partyIds.map(id => map.get(id)).filter(Boolean) as Party[];

        return OK(res, { parties: ordered.map(p => p.toSafeJSON()) });
    }

    private async getParty(req: Request, res: Response): Promise<void> {
        const partyId = req.params.partyId;
        const party = await this.partyContext.FindById(partyId);

        if (!party) return STATUSRESP(res, 404, { ok: false, error: "Party not found" });

        const members = await this.partyMemberContext.ListMembers(partyId);

        return OK(res, {
            party: party.toSafeJSON(),
            members: members.map(m => m.toSafeJSON()),
        });
    }

    private async joinParty(req: Request, res: Response): Promise<void> {
        const userId = req.auth?.userId;
        if (!userId) return STATUSRESP(res, 401, { ok: false, error: "Unauthorized" });

        const body = (req.body ?? {}) as JoinPartyBody;
        const inviteCode = (body.inviteCode ?? "").trim().toUpperCase();
        const characterName = (body.characterName ?? "").trim();

        if (!inviteCode) return STATUSRESP(res, 400, { ok: false, error: "inviteCode is required" });

        const party = await this.partyContext.FindByInviteCode(inviteCode);
        if (!party) return STATUSRESP(res, 404, { ok: false, error: "Invalid invite code" });

        const existing = await this.partyMemberContext.FindMembership(party.id, userId);
        if (existing) return OK(res, { party: party.toSafeJSON() }); // already joined

        const member = new PartyMember();
        member.partyId = party.id;
        member.userId = userId;
        member.partyRole = "PLAYER";
        member.characterName = characterName || null;

        await this.partyMemberContext.Save<PartyMember>(member);

        return OK(res, { party: party.toSafeJSON() });
    }
}
