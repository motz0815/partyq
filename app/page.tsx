import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <Button>Create Room</Button>
            <Link href="/room/GM4E">
                <Button>Join Room</Button>
            </Link>
        </div>
    )
}
