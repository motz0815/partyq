import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-2">
            <Link href="/host">
                <Button>Go to host page</Button>
            </Link>
            <Link href="/room/GM4E">
                <Button>Join Room</Button>
            </Link>
        </div>
    )
}
