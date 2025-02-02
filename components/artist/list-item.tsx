"use client";

import Image from "next/image";
import Link from "next/link";
import { Subscribe } from "./subscribe";

interface ListItemProps {
    artist : {
        id: string;
        name: string;
        image: string;
    }
}

export const ListItem = ({
    artist
} : ListItemProps ) => {

    return (
        <li className="w-full">
            <div
                className="w-full flex items-center justify-between p-1.5 hover:bg-neutral-700/80 transition-all rounded-md"
            >
                <div className="flex items-start gap-x-3">
                    <div className="size-8 lg:size-10 relative rounded-full overflow-hidden">
                        <Image
                            src={artist.image}
                            fill
                            alt={artist.name}
                            className="object-cover"
                        />
                    </div>
                    <h3 className="font-medium select-none">{artist.name}</h3>
                </div>
                <Subscribe artistId={artist.id} className="h-9 border-zinc-200 bg-transparent text-zinc-200" />
            </div>
        </li>
    )
}
