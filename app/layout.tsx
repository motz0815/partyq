import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import "@/styles/globals.css"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Project",
    description: "This project is the perfect project.",
    keywords: ["projects"],
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased",
                    GeistSans.variable,
                    GeistMono.variable,
                )}
            >
                {children}
                <Suspense>
                    <Toaster />
                </Suspense>
            </body>
        </html>
    )
}
