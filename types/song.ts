import { UUID } from "crypto"

export type Song = {
    title: string
    artist: string
    thumbnail?: string
    videoId: string
    addedBy: UUID
    addedByName: string
}
