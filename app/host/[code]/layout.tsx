import { getSession } from "@/lib/session"
import { createAdminClient } from "@/lib/supabase/admin"
import { getErrorRedirect } from "@/lib/utils"
import { redirect } from "next/navigation"

export default async function HostLayout(
    props: {
        children: React.ReactNode
        params: Promise<{ code: string }>
    }
) {
    const params = await props.params;

    const {
        children
    } = props;

    const session = await getSession()

    if (!session.isLoggedIn) {
        redirect(getErrorRedirect("/host", "You are not logged in"))
    }

    const supabase = createAdminClient()

    const { data: room, error } = await supabase
        .from("rooms")
        .select()
        .eq("code", params.code)
        .single()

    if (error || !room) {
        redirect(
            getErrorRedirect(
                "/host",
                "Room not found",
                "A room with the specified code was not found.",
            ),
        )
    }

    if (room.host !== session.uuid) {
        redirect(
            getErrorRedirect(
                "/host",
                "You are not the host",
                "You are not the host of this room.",
            ),
        )
    }

    return children
}
