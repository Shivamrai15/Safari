"use client";
import { RoomUser } from "@/types";
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import { getShortName } from "@/lib/utils";

interface UserCardInterface {
    user : RoomUser;
}

const UserCard = ({
    user
}: UserCardInterface) => {
    return (
        <li className="relative group">
            <div className="max-sm:hidden absolute bg-neutral-900 inset-px rounded-lg group-hover:bg-neutral-900/80 transition-all" />
            <div className="relative flex max-sm:items-center sm:flex-col gap-4 px-4 py-2 sm:p-4 dm:rounded-[calc(theme(borderRadius.lg)+1px)]">
                <div className="flex justify-center items-center sm:w-full">
                    <Avatar className="size-10 sm:size-16 md:size-20">
                        <AvatarImage src={user.image||""} />
                        <AvatarFallback>{getShortName(user.name)}</AvatarFallback>
                    </Avatar>
                </div>
                <h3 className="text-zinc-200 font-medium truncate sm:text-center">{user.name}</h3>
            </div>
            <div className="max-sm:hidden pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-white/10" />
        </li>
    )
}

export default UserCard
