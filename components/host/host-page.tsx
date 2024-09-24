"use client"

import { createClient } from "@/lib/supabase/client"
import { Room } from "@/types/global"
import { Song } from "@/types/song"
import { useEffect, useState } from "react"
import YouTube, { YouTubeProps } from "react-youtube"
import { HostInterface } from "./host-interface"

export function HostPage({ room }: { room: Room }) {
    const [queue, setQueue] = useState<Song[]>(room.queue as Song[])
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [progress, setProgress] = useState<number>(0)

    const supabase = createClient()

    useEffect(() => {
        const channels = supabase
            .channel("room-update-channel")
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "rooms",
                    filter: `code=eq.${room.code}`,
                },
                (payload) => {
                    const updatedRoom = payload.new as Room
                    setQueue(updatedRoom.queue as Song[])
                },
            )
            .subscribe()

        // unsubscribe from the channel when the component is unmounted
        return () => {
            channels.unsubscribe()
        }
    }, [room.code])

    const opts: YouTubeProps["opts"] = {
        width: "100%",
        height: "100%",
        playerVars: {
            autoplay: 1,
        },
        host: "https://www.youtube-nocookie.com",
    }

    const onPlayerStateChange: YouTubeProps["onStateChange"] = (event) => {
        switch (event.data) {
            case -1: // unstarted
                event.target.playVideo()
                break
            case 1: // playing
                // TODO start progress timer
                break
            case 2: // paused
                // TODO pause progress timer
                break
        }
    }

    return (
        <HostInterface
            roomCode={room.code ?? ""}
            queue={queue}
            currentIndex={currentIndex}
            onCurrentIndexChange={setCurrentIndex}
            progress={progress}
        >
            {queue && queue[currentIndex] && (
                <div className="relative pt-[56.25%]">
                    <YouTube
                        className="absolute inset-0"
                        onStateChange={onPlayerStateChange}
                        onEnd={() => {
                            if (currentIndex === queue.length - 1) {
                                return
                            }
                            setCurrentIndex((prev) => prev + 1)
                        }}
                        videoId={queue[currentIndex].videoId ?? ""}
                        opts={opts}
                    />
                </div>
            )}
        </HostInterface>
    )
}
