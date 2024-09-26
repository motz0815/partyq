"use server"

import { getSession } from "@/lib/session"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function updateCurrentIndex(code: string, index: number) {
    // check if the user is the host
    const session = await getSession()
    if (!session.isLoggedIn) {
        return {
            ok: false,
            message: "You are not logged in",
        }
    }

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

    if (room.host !== session.uuid) {
        return {
            ok: false,
            message: "You are not the host",
        }
    }

    // update the current index
    await supabase
        .from("rooms")
        .update({ current_index: index })
        .eq("code", code ?? "")

    revalidatePath(`/host/${code}`)
    revalidatePath(`/room/${code}`)

    return {
        ok: true,
    }
}
