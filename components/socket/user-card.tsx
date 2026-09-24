"use client";
import { ReactNode } from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import { getShortName } from "@/lib/utils";
import { JamMember } from "@/lib/jam-types";

interface UserCardInterface {
    user : JamMember;
    label?: string;
    children?: ReactNode;
}

const UserCard = ({
    user,
    label,
    children
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
                <div className="flex-1 sm:text-center">
                    <h3 className="text-zinc-200 font-medium truncate">{user.name}</h3>
                    {label && <p className="text-xs text-red-400 font-semibold">{label}</p>}
                </div>
                {children}
            </div>
            <div className="max-sm:hidden pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-white/10" />
        </li>
    )
}

export default UserCard
