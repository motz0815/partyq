import { HostPage } from "@/components/host/host-page"
import { createClient } from "@/lib/supabase/client"
import { notFound } from "next/navigation"

export async function generateMetadata(
    props: {
        params: Promise<{ code: string }>
    }
) {
    const params = await props.params;
    return {
        title: "Host - " + params.code,
    }
}

export default async function Page(props: { params: Promise<{ code: string }> }) {
    const params = await props.params;
    const supabase = createClient()

    const { data: room, error } = await supabase
        .from("rooms")
        .select()
        .eq("code", params.code)
        .single()

    if (error || !room) {
        notFound()
    }

    return <HostPage room={room} />
}
