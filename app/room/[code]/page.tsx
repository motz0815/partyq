import { RoomPage } from "@/components/room/room-page"
import { createClient } from "@/lib/supabase/client"

export default async function Page({ params }: { params: { code: string } }) {
    const supabase = createClient()

    const { data: room } = await supabase
        .from("rooms")
        .select()
        .eq("code", params.code)
        .single()

    if (!room) {
        throw new Error("Room not found")
    }

    return (
        <RoomPage
            roomCode={room.code!}
            currentSong={{
                artist: "Mclaren james",
                title: "lightnign",
                videoId: "49",
            }}
            maxSongsPerUser={2}
            queue={[]}
            userAddedSongs={1}
        />
    )
}
