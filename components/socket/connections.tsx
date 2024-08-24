"use client";

import { useSocketEvents } from "@/hooks/use-socket-events";
import { Avatar, AvatarImage } from "@/components/ui/avatar";


export const Connections = () => {

    const { remainingUsers } = useSocketEvents();

    if ( remainingUsers.length === 0 ) {
        return null;
    }

    return (
        <div className="max-w-xl w-full space-y-10">
            <h2 className="text-xl md:text-3xl font-semibold" >Connections</h2>
            <ul className="space-y-2" >
                { remainingUsers.map((user)=>(
                    <li key={user.socketId} className="w-full flex items-center space-x-6 px-6 py-3 hover:bg-neutral-900/80 transition-all rounded-md">
                        <Avatar>
                            <AvatarImage src={user?.image||"/assets/user.png"} alt="@user" />
                        </Avatar>
                        <div className="w-full group">
                            <p className="line-clamp-1 text-zinc-300">{user.name}</p>
                        </div>
                    </li>
                )) }
            </ul>
        </div>
    )
}