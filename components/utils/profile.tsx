"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

export const Profile = () => {

    const session = useSession();
    if ( session.status === "unauthenticated" || session.status === "loading" ) {
        return null;
    }

    return (
        <div className="w-full flex items-center gap-x-6 md:gap-x-10">
            <div className="aspect-square w-28 md:w-32 relative rounded-full overflow-hidden group">
                <Image
                    src={session.data?.user?.image||"/assets/user.png"}
                    alt={session.data?.user?.name || "Profile Image"}
                    fill
                    className="object-cover group-hover:scale-110 duration-500 transition-transform select-none"
                />
            </div>
            <div className="max-w-sm w-full md:space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-zinc-400 select-none">{session.data?.user?.name}</h3>
                <p className="text-3xl md:text-5xl font-extrabold select-none">Listen Again</p>
            </div>
        </div>
    )
}
