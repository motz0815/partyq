"use server"

import { getSession } from "@/lib/session"
import { createAdminClient } from "@/lib/supabase/admin"
import { Song } from "@/types/song"
import { revalidatePath } from "next/cache"

export async function login(formData: FormData) {
    const session = await getSession()

    session.username = (formData.get("username") as string) ?? ""
    session.isLoggedIn = true
    await session.save()

    revalidatePath(`/room/${(formData.get("code") as string) ?? ""}`)
}

export async function setUsername(formData: FormData) {
    const session = await getSession()

    session.username = (formData.get("username") as string) ?? ""
    await session.save()

    revalidatePath(`/room/${(formData.get("code") as string) ?? ""}`)
}

export async function addSongToQueue(code: string, song: Song) {
    const session = await getSession()

    const supabase = createAdminClient()

    const { data: room, error } = await supabase
        .from("rooms")
        .select()
        .eq("code", code ?? "")
        .single()

    if (error || !room) {
        return {
            ok: false,
            message: "Room not found",
        }
    }

    const queue = room.queue as Song[]

    const songsAddedByUser = queue.filter(
        (song, index) =>
            song.addedBy === session.uuid && index >= room.current_index,
    ).length

    if (songsAddedByUser >= 2) {
        return {
            ok: false,
            message: "You can only add 2 songs to the queue at a time.",
        }
    }

    queue.push({
        title: song.title ?? "",
        artist: song.artist ?? "",
        videoId: song.videoId ?? "",
        addedBy: session.uuid,
        addedByName: session.username,
    })

    await supabase.from("rooms").update({ queue }).eq("code", room.code!)

    revalidatePath(`/room/${room.code}`)

    return {
        ok: true,
    }
}

export async function searchSong(query: string): Promise<Song[]> {
    const session = await getSession()

    type SongResult = {
        id: string
        type: "video"
        thumbnail: { thumbnails: [] }
        title: string
        channelTitle: string
        shortBylineText: { runs: [] }
        length: { accessibility: Object; simpleText: string }
        isLive: boolean
    }

    const api = require("youtube-search-api")
    const result: SongResult[] = (
        await api.GetListByKeyword(query, false, 10, [{ type: "video" }])
    ).items

    return result.map((song) => ({
        title: song.title,
        artist: song.channelTitle,
        videoId: song.id,
        addedBy: session.uuid,
        addedByName: session.username,
    }))
}
