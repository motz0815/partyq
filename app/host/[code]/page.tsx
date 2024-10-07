import { HostPage } from "@/components/host/host-page"
import { createClient } from "@/lib/supabase/client"

export async function generateMetadata({
    params,
}: {
    params: { code: string }
}) {
    return {
        title: "Host - " + params.code,
    }
}

export default async function Page({ params }: { params: { code: string } }) {
    const supabase = createClient()

    const { data: room, error } = await supabase
        .from("rooms")
        .select()
        .eq("code", params.code)
        .single()

    if (error || !room) {
        throw new Error("Room not found")
    }

    return <HostPage room={room} />
}
