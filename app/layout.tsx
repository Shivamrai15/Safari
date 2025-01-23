import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "sonner";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { ModalProvider } from "@/providers/modal-provider";
import { SocketProvider } from "@/providers/socket-provider";
import { ProgressProvider } from "@/providers/progress.provider";

const inter = Figtree({subsets : ["latin"] });

export const metadata: Metadata = {
    title: "Safari",
    description: "Discover endless playlists, top hits, and albums in Hindi, English, and Punjabi. Stream the latest Hindi MP3 songs on Safari. Listen to high-quality audio online - all for free!",
    keywords : [
        "Music streaming",
        "Online music player",
        "Streaming music service",
        "Music app",
        "Listen to music online",
        "Free music streaming",
        "Music playlist",
        "Song library",
        "Artist radio",
        "Personalized music",
        "High-quality audio streaming",
        "Music discovery app",
        "Discover new music",
        "Curated playlists",
        "Music recommendations",
        "Stream music for free",
        "Unlimited music access",
        "Create playlists",
        "Share music",
        "Mobile music app",
        "Punjabi music",
        "English music",
        "Hindi music"
    ],
    openGraph: {
        images: {
            url : "https://res.cloudinary.com/dkaj1swfy/image/upload/v1723828208/meta_kmiyf4.avif",
            height : 1280,
            width : 720
        },
        type : "website",
    },  
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await auth();

    return (
        <html lang="en">
            <body className={inter.className} >
                <SessionProvider session={session} >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        disableTransitionOnChange
                    >
                        <QueryProvider>
                            <Toaster position="bottom-right" />
                            <ModalProvider/>
                            {/* <ProgressProvider/> */}
                            <SocketProvider/>
                            {children}
                        </QueryProvider>
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
