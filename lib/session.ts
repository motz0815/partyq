import { randomUUID, UUID } from "crypto"
import { getIronSession, SessionOptions } from "iron-session"
import { cookies } from "next/headers"

export interface SessionData {
    uuid: UUID
    username: string
    isLoggedIn: boolean
}

export const defaultSession: SessionData = {
    uuid: randomUUID(),
    username: "",
    isLoggedIn: false,
}

export const sessionOptions: SessionOptions = {
    password:
        process.env.SESSION_SECRET ??
        "default-very-secure-session-secret-that-is-32-characters-long",
    cookieName: "partyq-session",
    cookieOptions: {
        secure:
            process.env.VERCEL_ENV === "production" ||
            process.env.VERCEL_ENV === "preview",
    },
}

export async function getSession() {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
        session.isLoggedIn = defaultSession.isLoggedIn
        session.username = defaultSession.username
        session.uuid = defaultSession.uuid
    }

    return session
}
