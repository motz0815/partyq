"use client"

import {
    addSongToQueue,
    login,
    searchSong,
    setUsername,
} from "@/app/room/[code]/actions"
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
import { UUID } from "crypto"
import { CopyIcon, Loader2Icon, PlusCircleIcon, SearchIcon } from "lucide-react"
import Image from "next/image"
import { SetStateAction, useState } from "react"
import { SubmitButton } from "../ui/submit-button"

interface RoomPageProps {
    roomCode: string
    queue: Song[]
    currentIndex: number
    maxSongsPerUser: number
    user: {
        isLoggedIn: boolean
        username: string
        uuid: UUID
    }
}

export function RoomPage({
    roomCode,
    queue,
    currentIndex,
    maxSongsPerUser,
    user,
}: RoomPageProps) {
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<Song[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)

    const currentSong: Song = queue[currentIndex] ?? {
        title: "No song playing",
        artist: "N/A",
        thumbnail: "",
    }

    const songsAddedByUser: number = queue.filter(
        (song, index) => song.addedBy === user.uuid && index >= currentIndex,
    ).length

    function copyRoomCode() {
        navigator.clipboard
            .writeText(roomCode)
            .then(() => toast({ title: "Room code copied to clipboard!" }))
            .catch((err) => console.error("Failed to copy room code: ", err))
    }

    async function handleSearch() {
        setIsSearching(true)
        // API call
        const results = await searchSong(searchQuery)

        setSearchResults(results)

        setIsSearching(false)
    }

    async function addSong(song: Song) {
        const response = await addSongToQueue(roomCode, song)
        if (response.ok) {
            toast({ title: "Song added to queue!" })
            // close dialog
            setDialogOpen(false)
        } else {
            toast({ title: "Error adding song", description: response.message })
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 p-4 text-white md:p-8">
            <header className="mb-8 flex items-center justify-between md:container">
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

            <main className="space-y-8 md:container">
                <section className="rounded-lg bg-white/10 p-4 md:p-6">
                    <h2 className="mb-4 text-xl font-bold md:text-2xl">
                        Now Playing
                    </h2>
                    <div className="flex items-center space-x-4">
                        <Image
                            src={
                                currentSong.thumbnail ??
                                `https://i.ytimg.com/vi_webp/${currentSong.videoId}/mqdefault.webp`
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
                            {queue
                                .filter((_song, index) => index > currentIndex)
                                .map((song, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center space-x-4 rounded-lg bg-white/5 p-3"
                                    >
                                        <Image
                                            src={
                                                song.thumbnail ??
                                                `https://i.ytimg.com/vi_webp/${song.videoId}/mqdefault.webp`
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
                                                Added by {song.addedByName}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </ScrollArea>
                </section>

                <section className="rounded-lg bg-white/10 p-4 text-center md:p-6">
                    {user.isLoggedIn ? (
                        <>
                            {user.username ? (
                                <>
                                    <p>
                                        You are currently logged in as{" "}
                                        {user.username}.
                                    </p>
                                    <p className="mb-4">
                                        You can add up to{" "}
                                        {maxSongsPerUser - songsAddedByUser}{" "}
                                        more songs.
                                    </p>
                                    <Dialog
                                        open={dialogOpen}
                                        onOpenChange={setDialogOpen}
                                    >
                                        <DialogTrigger asChild>
                                            <Button
                                                disabled={
                                                    songsAddedByUser >=
                                                    maxSongsPerUser
                                                }
                                                className="bg-green-500 hover:bg-green-600"
                                            >
                                                <PlusCircleIcon className="mr-2 h-5 w-5" />
                                                Add a Song
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="flex max-h-[80vh] max-w-3xl flex-col">
                                            <DialogHeader className="flex-shrink-0">
                                                <DialogTitle>
                                                    Add a Song
                                                </DialogTitle>
                                            </DialogHeader>
                                            <div className="flex-1 overflow-y-auto">
                                                <div className="grid gap-4 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Input
                                                            placeholder="Search for songs or artists..."
                                                            value={searchQuery}
                                                            onChange={(e: {
                                                                target: {
                                                                    value: SetStateAction<string>
                                                                }
                                                            }) =>
                                                                setSearchQuery(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        <Button
                                                            onClick={
                                                                handleSearch
                                                            }
                                                        >
                                                            <SearchIcon className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    {isSearching ? (
                                                        <div className="flex justify-center">
                                                            <Loader2Icon className="h-8 w-8 animate-spin" />
                                                        </div>
                                                    ) : searchResults.length >
                                                      0 ? (
                                                        <ul className="space-y-2">
                                                            {searchResults.map(
                                                                (song) => (
                                                                    <li
                                                                        key={
                                                                            song.videoId
                                                                        }
                                                                        className="flex items-center justify-between rounded-lg bg-gray-100 p-2"
                                                                    >
                                                                        <div className="flex items-center space-x-2">
                                                                            <Image
                                                                                src={
                                                                                    song.thumbnail ??
                                                                                    `https://i.ytimg.com/vi_webp/${song.videoId}/mqdefault.webp`
                                                                                }
                                                                                alt={`${song.title} by ${song.artist}`}
                                                                                width={
                                                                                    40
                                                                                }
                                                                                height={
                                                                                    40
                                                                                }
                                                                                className="rounded-md"
                                                                            />
                                                                            <div>
                                                                                <p className="font-semibold">
                                                                                    {
                                                                                        song.title
                                                                                    }
                                                                                </p>
                                                                                <p className="text-sm text-gray-600">
                                                                                    {
                                                                                        song.artist
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <Button
                                                                            onClick={() =>
                                                                                addSong(
                                                                                    song,
                                                                                )
                                                                            }
                                                                            size="sm"
                                                                        >
                                                                            <PlusCircleIcon className="h-4 w-4" />
                                                                        </Button>
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    ) : searchQuery &&
                                                      !isSearching ? (
                                                        <p>
                                                            No songs found.
                                                            Please try a
                                                            different search.
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </>
                            ) : (
                                <>
                                    <p>
                                        You must set a username to add songs to
                                        the queue.
                                    </p>
                                    <form action={setUsername}>
                                        <Input
                                            required
                                            name="username"
                                            placeholder="Username"
                                            className="text-primary"
                                        />
                                        <input
                                            name="code"
                                            value={roomCode}
                                            hidden
                                        />
                                        <SubmitButton>
                                            Set Username
                                        </SubmitButton>
                                    </form>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <p>You are currently not logged in.</p>
                            <form action={login}>
                                <Input
                                    required
                                    name="username"
                                    placeholder="Username"
                                    className="text-primary"
                                />
                                <input name="code" value={roomCode} hidden />
                                <SubmitButton>Log in to add songs</SubmitButton>
                            </form>
                        </>
                    )}
                </section>
            </main>

            <footer className="mt-8 text-center">
                <p>
                    You have added {songsAddedByUser} of {maxSongsPerUser} songs
                </p>
            </footer>
        </div>
    )
}
