import { RoomPage } from "@/components/room/room-page"
import { getSession } from "@/lib/session"
import { createClient } from "@/lib/supabase/client"
import { Song } from "@/types/song"

export async function generateMetadata(
    props: {
        params: Promise<{ code: string }>
    }
) {
    const params = await props.params;
    return {
        title: "Room - " + params.code,
    }
}

export default async function Page(props: { params: Promise<{ code: string }> }) {
    const params = await props.params;
    const supabase = createClient()

    const { data: room } = await supabase
        .from("rooms")
        .select()
        .eq("code", params.code)
        .single()

    if (!room) {
        throw new Error("Room not found")
    }

    const session = await getSession()

    return (
        <RoomPage
            roomCode={room.code!}
            currentIndex={room.current_index ?? 0}
            maxSongsPerUser={2}
            queue={(room.queue as Song[]) ?? []}
            user={{
                isLoggedIn: session.isLoggedIn,
                uuid: session.uuid,
                username: session.username,
            }}
        />
    )
}
