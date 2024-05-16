"use client";

import { usePlaylistModal } from "@/hooks/use-playlist-modal";
import { Plus } from "lucide-react";

export const CreatePlaylistCard = () => {

    const { onOpen } = usePlaylistModal();

    return (
        <div
            className="w-full border-2 rounded-md border-dotted p-3 bg-neutral-900/40 hover:bg-neutral-900 transition-all md:cursor-pointer"
            onClick={()=>onOpen()}
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
