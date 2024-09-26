"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Song } from "@/types/song"
import Image from "next/image"
import { useCallback, useEffect, useRef } from "react"

interface QueueProps {
    queue: Song[]
    currentIndex: number
    onCurrentIndexChange: (index: number) => void
}

export default function QueueScrollArea({
    queue,
    currentIndex,
    onCurrentIndexChange,
}: QueueProps) {
    const scrollViewportRef = useRef<HTMLDivElement>(null)
    const itemRefs = useRef<(HTMLLIElement | null)[]>([])

    const setItemRef = useCallback(
        (el: HTMLLIElement | null, index: number) => {
            itemRefs.current[index] = el
        },
        [],
    )

    useEffect(() => {
        if (scrollViewportRef.current && itemRefs.current[currentIndex]) {
            const viewport = scrollViewportRef.current
            const currentItem = itemRefs.current[currentIndex]

            const viewportRect = viewport.getBoundingClientRect()
            const itemRect = currentItem.getBoundingClientRect()

            const isItemInView =
                itemRect.top >= viewportRect.top &&
                itemRect.bottom <= viewportRect.bottom

            if (!isItemInView) {
                const scrollTop = currentItem.offsetTop - viewport.offsetTop
                viewport.scrollTo({
                    top: scrollTop,
                    behavior: "smooth",
                })
            }
        }
    }, [currentIndex])

    return (
        <ScrollArea className="h-[calc(100vh-24rem)] w-full rounded-md border border-white/20">
            <div ref={scrollViewportRef} className="p-4">
                <ul className="space-y-4">
                    {queue.map((song, index) => (
                        <li
                            key={song.videoId}
                            ref={(el) => setItemRef(el, index)}
                            className={cn(
                                "flex items-center space-x-4 rounded-lg bg-white/10 p-3 hover:cursor-pointer",
                                {
                                    "bg-white/30": index === currentIndex,
                                },
                            )}
                            onClick={() => onCurrentIndexChange(index)}
                        >
                            <Image
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
                    ))}
                    {queue.length === 0 && (
                        <li className="text-center text-lg">
                            No songs in queue. Visit the room page to add songs.
                        </li>
                    )}
                </ul>
            </div>
        </ScrollArea>
    )
}
