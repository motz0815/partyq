"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Song } from "@/types/song"
import { ClipboardCheck, CopyIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ReactNode, useEffect, useRef } from "react"
import { ImageWithFallback } from "../ui/image-with-fallback"
import { ScrollArea } from "../ui/scroll-area"
import { RoomQRCode } from "./qr-code"

interface HostPageProps {
    roomCode: string
    queue: Song[]
    progress: number
    children?: ReactNode
    currentIndex: number
    onCurrentIndexChange: (index: number) => void
}

export function HostInterface({
    roomCode,
    queue,
    progress,
    children,
    currentIndex,
    onCurrentIndexChange,
}: HostPageProps) {
    const copyRoomCode = () => {
        navigator.clipboard
            .writeText(roomCode)
            .then(() =>
                toast({
                    title: "Room code copied to clipboard!",
                    action: <ClipboardCheck className="size-6" />,
                }),
            )
            .catch((err) => console.error("Failed to copy room code: ", err))
    }

    const currentSongRef = useRef<HTMLLIElement>(null)

    useEffect(() => {
        if (currentSongRef.current) {
            currentSongRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        }
    }, [currentIndex])

    return (
        <div className="relative">
            <div className="absolute left-0 top-0 -z-10 h-full w-full overflow-hidden bg-gradient-to-br from-slate-500 to-indigo-950">
                <Image
                    src={
                        queue[currentIndex]?.thumbnail ??
                        `https://i.ytimg.com/vi_webp/${queue[currentIndex]?.videoId}/mqdefault.webp`
                    }
                    className="absolute -top-[50%] z-10 aspect-square w-[200%] animate-rotate mix-blend-luminosity blur-3xl"
                    width={600}
                    height={600}
                    alt="PartyQ background"
                />
                <Image
                    src={
                        queue[currentIndex]?.thumbnail ??
                        `https://i.ytimg.com/vi_webp/${queue[currentIndex]?.videoId}/mqdefault.webp`
                    }
                    width={600}
                    height={600}
                    className="absolute -top-[50%] aspect-square w-[200%] animate-rotate blur-3xl delay-10000 direction-reverse"
                    alt="PartyQ background"
                />
            </div>
            <div className="flex min-h-screen flex-col bg-black/30 p-8 text-white backdrop-blur-3xl">
                <header className="mb-8 flex w-full items-center justify-between">
                    <Link href="/">
                        <h1 className="text-4xl font-bold">PartyQ Host</h1>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <span className="text-2xl font-semibold">
                            Room Code:{" "}
                            <span className="font-extrabold">{roomCode}</span>
                        </span>
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={copyRoomCode}
                            aria-label="Copy room code"
                            className="bg-white hover:bg-gray-200"
                        >
                            <CopyIcon className="h-6 w-6" />
                        </Button>
                    </div>
                </header>

                <main className="flex flex-grow flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0">
                    <section className="flex flex-col items-center justify-start lg:w-2/3">
                        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black/50 shadow-2xl outline outline-1 outline-white/20 backdrop-blur-lg">
                            {children}
                        </div>
                        <div className="mt-6 flex w-full flex-col items-center">
                            <Progress
                                value={progress}
                                max={100}
                                className="h-3 w-full max-w-lg"
                            />
                            <div className="mt-4 flex flex-col items-center">
                                <h2 className="text-3xl font-bold">
                                    {queue[currentIndex]?.title ||
                                        "No song playing"}
                                </h2>
                                <p className="text-lg text-muted">
                                    {queue[currentIndex]?.artist || ""}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="flex flex-col lg:w-1/3">
                        <h3 className="mb-4 text-center text-3xl font-bold lg:text-left">
                            Queue
                        </h3>
                        <ScrollArea className="max-h-[500px] flex-grow rounded-md border border-white/20 bg-white/10 p-4 shadow-md backdrop-blur-lg">
                            <ul className="space-y-4">
                                {queue.map((song, index) => {
                                    const isCurrent = index === currentIndex
                                    return (
                                        <li
                                            key={index}
                                            ref={
                                                isCurrent
                                                    ? currentSongRef
                                                    : null
                                            }
                                            className={cn(
                                                "flex items-center space-x-4 rounded-lg border border-white/20 bg-white/10 p-3 shadow-md backdrop-blur-lg hover:cursor-pointer",
                                                {
                                                    "bg-white/30":
                                                        index === currentIndex,
                                                },
                                            )}
                                            onClick={() =>
                                                onCurrentIndexChange(index)
                                            }
                                        >
                                            <ImageWithFallback
                                                src={
                                                    song.thumbnail ??
                                                    `https://i.ytimg.com/vi_webp/${song.videoId}/mqdefault.webp`
                                                }
                                                width={128}
                                                height={128}
                                                alt={`${song.title} by ${song.artist}`}
                                                className="aspect-video h-20 rounded-md object-cover"
                                            />
                                            <div>
                                                <h4 className="text-xl font-semibold">
                                                    {song.title}
                                                </h4>
                                                <p className="text-lg text-gray-300">
                                                    {song.artist}
                                                </p>
                                            </div>
                                        </li>
                                    )
                                })}
                                {queue.length === 0 && (
                                    <li className="text-center text-lg">
                                        No songs in queue. Visit the room page
                                        to add songs.
                                    </li>
                                )}
                            </ul>
                        </ScrollArea>
                        <div className="mt-8 w-full rounded-md border border-white/20 bg-white/10 p-4 shadow-md backdrop-blur-lg">
                            <h3 className="mb-2 text-2xl font-bold">
                                Add songs to the queue
                            </h3>
                            <p className="mb-4">
                                Visit partyq.vercel.app and enter room code{" "}
                                <span className="font-extrabold">
                                    {roomCode}
                                </span>
                            </p>
                            <RoomQRCode roomCode={roomCode} />
                        </div>
                    </section>
                </main>

                <footer className="mt-8 text-center">
                    <div className="text-3xl font-bold text-white/80">
                        PartyQ
                    </div>
                </footer>
            </div>
        </div>
    )
}
