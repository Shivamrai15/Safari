"use client";

import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog"
import { PlaylistForm } from "@/components/forms/playlist-form";
import { usePlaylistModal } from "@/hooks/use-playlist-modal";


export const PlaylistModal = () => {

    const { isOpen, onClose, loading } = usePlaylistModal();

    const handleOnClose = ( open : boolean ) => {
        if(!open && !loading) {
            onClose();
        }
    }

    return (
        <Dialog open = {isOpen} onOpenChange={handleOnClose} >
            <DialogContent className="bg-neutral-800 max-w-96 w-full rounded-lg">
                <PlaylistForm/>
            </DialogContent>
        </Dialog>
    )
}
