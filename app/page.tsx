import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/ui/submit-button"
import Link from "next/link"
import { joinRoom } from "./actions"

export default function Home() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-2">
            <Link href="/host">
                <Button>Go to host page</Button>
            </Link>
            <form action={joinRoom}>
                <Input name="code" placeholder="Room code" />
                <SubmitButton>Join room</SubmitButton>
            </form>
        </div>
    )
}
