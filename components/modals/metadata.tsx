"use client";

import { Metadata } from "@prisma/client";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import {
    Music,
    Globe,
    Video,
    Pen,
    FileText,
    Heart,
    Piano
} from 'lucide-react';


interface MetadataProps {
    metadata : Metadata & {
        moods : {
            name : string
        }[]
    },
    isOpen : boolean;
    closeModal : () => void;
}

export const MetadataModal = ({
    metadata,
    isOpen,
    closeModal
}: MetadataProps) => {
    
    const handleClose = (close: boolean) => {
        if (!close) {
            closeModal();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl w-full p-6 py-10 max-h-[80vh] h-full overflow-y-auto bg-neutral-900">
                <div className="space-y-8 select-none">
                    <div
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-32 flex items-center text-zinc-400 gap-3">
                                <Globe className="size-4" />
                                <span>Language</span>
                            </div>
                            <div className="text-zinc-100 font-medium">
                                {metadata.language}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-32 flex items-center text-zinc-400 gap-3">
                                <Music className="size-4" />
                                <span>Genre</span>
                            </div>
                            <div className="text-zinc-100 font-medium">
                                {metadata.genre}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-32 flex items-center text-zinc-400 gap-3">
                                <Video className="size-4" />
                                <span>Director</span>
                            </div>
                            <div className="text-zinc-100 font-medium">
                                {metadata.director}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-32 flex items-center text-zinc-400 gap-3">
                                <Pen className="size-4" />
                                <span>Lyricist</span>
                            </div>
                            <div className="text-zinc-100 font-medium">
                                {metadata.lyricist}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <div className="flex items-center text-zinc-400 gap-3">
                                <FileText className="size-4" />
                                <span className="text-zinc-100 font-semibold">Description</span>
                            </div>
                            <p className="text-zinc-400 text-sm text-justify">
                                {metadata.description}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center text-zinc-400 gap-3">
                                <Heart className="size-4" />
                                <span className="text-zinc-100 font-semibold">Mood</span>
                            </div>
                            <div className="text-zinc-400 text-sm text-justify flex flex-wrap gap-2">
                                {metadata.moods.map((mood) => (
                                    <div key={mood.name} className="bg-neutral-800/70 px-2.5 py-1 rounded-full">
                                        {mood.name}
                                    </div>
                                ))} 
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center text-zinc-400 gap-3">
                                <Piano className="size-4" />
                                <span className="text-zinc-100 font-semibold">Instrumentation</span>
                            </div>
                            <div className="text-zinc-400 text-sm text-justify flex flex-wrap gap-2">
                                {metadata.instrumentation.map((instrumentation) => (
                                    <div key={instrumentation} className="bg-neutral-800/70 px-2.5 py-1 rounded-full">
                                        {instrumentation}
                                    </div>
                                ))} 
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
