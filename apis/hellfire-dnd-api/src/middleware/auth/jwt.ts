import jwt from "jsonwebtoken";

export type AuthTokenPayload = {
    userId: string;
    role: "DM" | "PLAYER" | "ADMIN";
};

export function signAccessToken(payload: AuthTokenPayload) {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): AuthTokenPayload {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
    return jwt.verify(token, process.env.JWT_SECRET) as AuthTokenPayload;
}
