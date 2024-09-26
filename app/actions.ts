"use server"

import { createClient } from "@/lib/supabase/client"
import { getErrorRedirect, getStatusRedirect } from "@/lib/utils"
import { redirect } from "next/navigation"

export async function joinRoom(formData: FormData) {
    const code = formData.get("code") as string

    const supabase = createClient()

    const { data: room, error } = await supabase
        .from("rooms")
        .select()
        .eq("code", code.toUpperCase())
        .single()

    if (error || !room) {
        redirect(
            getErrorRedirect(
                "/",
                "Room not found",
                "A room with the specified code was not found.",
            ),
        )
    }

    redirect(
        getStatusRedirect(
            `/room/${code}`,
            "Joined Room",
            "Joined the room with code " + code,
        ),
    )
}
