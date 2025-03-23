"use client";

import { useSocketEvents } from "@/hooks/use-socket-events";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import UserCard from "./user-card";


export const Connections = () => {

    const { remainingUsers } = useSocketEvents();

    if ( remainingUsers.length === 0 ) {
        return null;
    }

    return (
        <div className="max-w-4xl w-full space-y-6 mx-auto">
            <h2 className="text-lg md:text-2xl font-semibold select-none" >Friends</h2>
            <ul className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" >
                { remainingUsers.map((user)=>(
                    <UserCard key={user.socketId} user={user} />
                )) }
            </ul>
        </div>
    )
}