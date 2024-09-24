import { RoomPage } from "@/components/room/room-page"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default async function Page({ params }: { params: { code: string } }) {
    const supabase = createClient()

    const { data: room, error } = await supabase
        .from("rooms")
        .select()
        .eq("code", params.code)
        .single()

    if (error || !room) {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center gap-2">
                <p>A room with the specified code was not found.</p>
                <Link href="/">
                    <Button>Return to homepage</Button>
                </Link>
            </div>
        )
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
