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

export async function addSongToQueue(formData: FormData) {
    const session = await getSession()

    const supabase = createAdminClient()

    const { data: room, error } = await supabase
        .from("rooms")
        .select()
        .eq("code", (formData.get("code") as string) ?? "")
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
        title: (formData.get("title") as string) ?? "",
        artist: (formData.get("artist") as string) ?? "",
        videoId: (formData.get("videoId") as string) ?? "",
        addedBy: session.uuid,
        addedByName: session.username,
    })

    await supabase.from("rooms").update({ queue }).eq("code", room.code!)

    revalidatePath(`/room/${room.code}`)
}
