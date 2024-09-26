import { createAdminClient } from "@/lib/supabase/admin"
import { getErrorRedirect } from "@/lib/utils"
import { redirect } from "next/navigation"

export default async function HostLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { code: string }
}) {
    const supabase = createAdminClient()

    const { data: room, error } = await supabase
        .from("rooms")
        .select()
        .eq("code", params.code)
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

    return children
}
