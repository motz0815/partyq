"use client"

import { getURL } from "@/lib/utils"
import { QRCodeSVG } from "qrcode.react"

export function RoomQRCode({ roomCode }: { roomCode: string }) {
    const url = getURL(`/room/${roomCode}`)

    return (
        <div className="flex items-center justify-center">
            <QRCodeSVG value={url} size={384} marginSize={1} />
        </div>
    )
}
