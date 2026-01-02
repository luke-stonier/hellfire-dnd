import { Request, Response, NextFunction } from "express";
import Container from "typedi";
import PartyMemberContext from "../../contexts/PartyMemberContext";

declare global {
    namespace Express {
        interface Request {
            partyRole?: "DM" | "PLAYER";
        }
    }
}

export function requirePartyMember(partyIdParam: string = "partyId") {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.auth?.userId;
        if (!userId) return res.status(401).json({ ok: false, error: "Unauthorized" });

        const partyId = (req.params as any)[partyIdParam];
        if (!partyId) return res.status(400).json({ ok: false, error: "Missing partyId" });

        const partyMemberContext = Container.get(PartyMemberContext);
        const membership = await partyMemberContext.FindMembership(partyId, userId);

        if (!membership) return res.status(403).json({ ok: false, error: "Forbidden" });

        req.partyRole = membership.partyRole;
        next();
    };
}

export function requirePartyDM() {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.partyRole !== "DM") return res.status(403).json({ ok: false, error: "DM only" });
        next();
    };
}
