"use client"

import { Room } from "@/types/global"
import { Song } from "@/types/song"
import { useState } from "react"
import YouTube, { YouTubeProps } from "react-youtube"
import { HostInterface } from "./host-interface"

export function HostPage({ room }: { room: Room }) {
    const [queue, setQueue] = useState<Song[]>(room.queue as Song[])
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [progress, setProgress] = useState<number>(0)

    // TODO set up realtime queue updates from supabase

    const opts: YouTubeProps["opts"] = {
        playerVars: {
            autoplay: 1,
        },
        host: "https://www.youtube-nocookie.com",
    }

    const onPlayerStateChange: YouTubeProps["onStateChange"] = (event) => {
        console.log("state change", event)
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
            <YouTube
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
        </HostInterface>
    )
}
