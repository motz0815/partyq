"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import { Song } from "@/types/song"
import { CopyIcon, Loader2Icon, PlusCircleIcon, SearchIcon } from "lucide-react"
import Image from "next/image"
import { SetStateAction, useState } from "react"

interface RoomPageProps {
    roomCode: string
    currentSong: Song
    queue: Song[]
    userAddedSongs: number
    maxSongsPerUser: number
}

export function RoomPage({
    roomCode,
    currentSong,
    queue,
    userAddedSongs,
    maxSongsPerUser,
}: RoomPageProps) {
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<Song[]>([])
    const [searchQuery, setSearchQuery] = useState("")

    const copyRoomCode = () => {
        navigator.clipboard
            .writeText(roomCode)
            .then(() => toast({ title: "Room code copied to clipboard!" }))
            .catch((err) => console.error("Failed to copy room code: ", err))
    }

    const handleSearch = () => {
        setIsSearching(true)
        // Simulating API call
        setTimeout(() => {
            setSearchResults([
                {
                    videoId: "1",
                    title: "Song 1",
                    artist: "Artist 1",
                    thumbnail: "/placeholder.svg?height=80&width=80",
                },
                {
                    videoId: "2",
                    title: "Song 2",
                    artist: "Artist 2",
                    thumbnail: "/placeholder.svg?height=80&width=80",
                },
            ])
            setIsSearching(false)
        }, 1500)
    }

    const addSongToQueue = (song: Song) => {
        if (userAddedSongs < maxSongsPerUser) {
            toast({ title: "Song added to the queue!" })
            // Implement actual song addition logic here
        } else {
            toast({
                title: `You have reached your song limit of ${maxSongsPerUser} songs.`,
                variant: "destructive",
            })
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 p-4 text-white md:p-8">
            <header className="container mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-bold md:text-4xl">PartyQ Room</h1>
                <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold md:text-2xl">
                        Room Code: {roomCode}
                    </span>
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={copyRoomCode}
                        aria-label="Copy room code"
                        className="bg-white text-purple-600 hover:bg-gray-200"
                    >
                        <CopyIcon className="h-4 w-4 md:h-6 md:w-6" />
                    </Button>
                </div>
            </header>

            <main className="container space-y-8">
                <section className="rounded-lg bg-white/10 p-4 md:p-6">
                    <h2 className="mb-4 text-xl font-bold md:text-2xl">
                        Now Playing
                    </h2>
                    <div className="flex items-center space-x-4">
                        <Image
                            src={
                                currentSong.thumbnail ??
                                "/placeholder.svg?height=120&width=120"
                            }
                            alt={`${currentSong.title} by ${currentSong.artist}`}
                            width={120}
                            height={120}
                            className="rounded-md"
                        />
                        <div>
                            <h3 className="text-lg font-semibold md:text-xl">
                                {currentSong.title}
                            </h3>
                            <p className="text-sm text-gray-300 md:text-base">
                                {currentSong.artist}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-lg bg-white/10 p-4 md:p-6">
                    <h2 className="mb-4 text-xl font-bold md:text-2xl">
                        Up Next
                    </h2>
                    <ScrollArea className="h-64 md:h-80">
                        <ul className="space-y-4">
                            {queue.map((song, index) => (
                                <li
                                    key={index}
                                    className="flex items-center space-x-4 rounded-lg bg-white/5 p-3"
                                >
                                    <Image
                                        src={
                                            song.thumbnail ??
                                            "/placeholder.svg?height=60&width=60"
                                        }
                                        alt={`${song.title} by ${song.artist}`}
                                        width={60}
                                        height={60}
                                        className="rounded-md"
                                    />
                                    <div>
                                        <h4 className="font-semibold">
                                            {song.title}
                                        </h4>
                                        <p className="text-sm text-gray-300">
                                            {song.artist}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Added by Guest123
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
                </section>

                <section className="rounded-lg bg-white/10 p-4 text-center md:p-6">
                    <p className="mb-4">
                        You can add up to {maxSongsPerUser - userAddedSongs}{" "}
                        more songs.
                    </p>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-green-500 hover:bg-green-600">
                                <PlusCircleIcon className="mr-2 h-5 w-5" />
                                Add a Song
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add a Song</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        placeholder="Search for songs or artists..."
                                        value={searchQuery}
                                        onChange={(e: {
                                            target: {
                                                value: SetStateAction<string>
                                            }
                                        }) => setSearchQuery(e.target.value)}
                                    />
                                    <Button onClick={handleSearch}>
                                        <SearchIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                                {isSearching ? (
                                    <div className="flex justify-center">
                                        <Loader2Icon className="h-8 w-8 animate-spin" />
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <ul className="space-y-2">
                                        {searchResults.map((song) => (
                                            <li
                                                key={song.videoId}
                                                className="flex items-center justify-between rounded-lg bg-gray-100 p-2"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <Image
                                                        src={
                                                            song.thumbnail ?? ""
                                                        }
                                                        alt={`${song.title} by ${song.artist}`}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-md"
                                                    />
                                                    <div>
                                                        <p className="font-semibold">
                                                            {song.title}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {song.artist}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() =>
                                                        addSongToQueue(song)
                                                    }
                                                    size="sm"
                                                >
                                                    <PlusCircleIcon className="h-4 w-4" />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : searchQuery && !isSearching ? (
                                    <p>
                                        No songs found. Please try a different
                                        search.
                                    </p>
                                ) : null}
                            </div>
                        </DialogContent>
                    </Dialog>
                </section>
            </main>

            <footer className="mt-8 text-center">
                <p>
                    You have added {userAddedSongs} of {maxSongsPerUser} songs
                </p>
            </footer>
        </div>
    )
}
