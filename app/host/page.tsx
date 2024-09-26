import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SubmitButton } from "@/components/ui/submit-button"
import { getSession } from "@/lib/session"
import { createAdminClient } from "@/lib/supabase/admin"
import { Room } from "@/types/global"
import { Song } from "@/types/song"
import { formatDistance } from "date-fns"
import { Plus } from "lucide-react"
import Link from "next/link"
import { createRoom } from "./actions"

export default async function HostHubPage() {
    const session = await getSession()

    let rooms: Room[] = []

    if (session.isLoggedIn) {
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from("rooms")
            .select()
            .eq("host", session.uuid)

        if (!error) {
            rooms = data
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-purple-600 to-pink-500">
            <Card className="flex flex-col items-center justify-center">
                <CardHeader>
                    <CardTitle className="text-purple-600">
                        Your active rooms
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {rooms.length === 0 ? (
                        <p>You don&apos;t have any active rooms</p>
                    ) : (
                        <ul className="flex flex-col items-center justify-center gap-4">
                            {rooms.map((room) => (
                                <li key={room.code}>
                                    <Link href={`/host/${room.code}`}>
                                        <Card className="transition-shadow hover:shadow-md">
                                            <CardHeader>
                                                <CardTitle>
                                                    Room Code: {room.code}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p>
                                                    Queue Length:{" "}
                                                    {
                                                        (room.queue as Song[])
                                                            .length
                                                    }
                                                </p>
                                                <p>
                                                    Expires:{" "}
                                                    <span
                                                        // If the room expires in less than 6 hours, make the text red
                                                        className={
                                                            new Date(
                                                                room.expires_at,
                                                            ).getTime() -
                                                                Date.now() <
                                                            6 * 60 * 60 * 1000
                                                                ? "text-red-500"
                                                                : ""
                                                        }
                                                    >
                                                        {formatDistance(
                                                            new Date(
                                                                room.expires_at,
                                                            ),
                                                            Date.now(),
                                                            {
                                                                addSuffix: true,
                                                            },
                                                        )}
                                                    </span>
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
            <Card className="flex flex-col items-center justify-center">
                <CardHeader>
                    <CardTitle className="text-purple-600">
                        Create a Room
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createRoom}>
                        <SubmitButton prefix={<Plus className="size-4" />}>
                            Create Room
                        </SubmitButton>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
