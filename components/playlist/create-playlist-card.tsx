"use client";

import { useSession } from "next-auth/react";
import { useAccount } from "@/hooks/use-account";
import { usePlaylist } from "@/hooks/use-playlist";
import { usePlaylistModal } from "@/hooks/use-playlist-modal";
import { Plus } from "lucide-react";
import { usePremiumModal } from "@/hooks/use-premium-modal";

export const CreatePlaylistCard = () => {

    const session = useSession();
    const { onOpen } = usePlaylistModal();
    const { data } : { data : { isActive : boolean } } = useAccount();
    const playlist = usePlaylist();
    const { onOpenPremiumModal } = usePremiumModal();

    const handlePlaylistModal = () => {
        if ( session.status === "authenticated") {
            if (  data &&  data.isActive ) {
                onOpen();
            } else {
                if ( playlist.data && playlist.data.length < 5 ) {
                    onOpen();
                } else {
                    onOpenPremiumModal();
                }
            }
        }
    }

    return (
        <div
            className="w-full border-2 rounded-md border-dotted p-3 bg-neutral-900/40 hover:bg-neutral-900 transition-all md:cursor-pointer"
            onClick={handlePlaylistModal}
        >
            <div className="flex flex-col items-center justify-center w-full h-full space-y-3 text-zinc-300">
                <Plus className="h-8 w-8" />
                <span className="text-sm">
                    New Playlist
                </span>
            </div>
        </div>
    )
}
