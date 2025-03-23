"use client";

import { RoomUser } from "@/types";
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { getShortName } from "@/lib/utils";

interface JoinRoomInterface {
    users : RoomUser[];
    roomId: string;
    joinRoom : (roomId: string, isHost: boolean)=>void;
}


const JoinRoom = ({
    users,
    roomId,
    joinRoom,
}: JoinRoomInterface ) => {

    const host = users.find(user=>user.isHost) || users[0];
    const remainingUsers = users.filter((user)=>user.isHost===false);
    const usersToDisplay = [host, ...remainingUsers.slice(0, 4)];

    
    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div className="space-y-4">
                <div className="flex -space-x-1 justify-center">
                    {
                        usersToDisplay.map((user, index)=>(
                            <Avatar key={user.socketId} className="ring-4 ring-neutral-900/90 size-12 md:size-14 " style={{ zIndex : usersToDisplay.length-index }} >
                                <AvatarImage src={user?.image||""} />
                                <AvatarFallback>{getShortName(user.name||"U")}</AvatarFallback>
                            </Avatar>
                        ))
                    }
                </div>
                <h1 className="font-bold text-zinc-100 text-lg md:text-2xl text-center select-none">Join {host.name.split(" ")[0]}&apos;s Room?</h1>
            </div>
            <div className="flex items-center justify-center gap-x-4 mt-6">
                <Button
                    className="rounded-full select-none"
                    onClick={()=>joinRoom(roomId, false)}
                    size="sm"
                    variant="secondary"
                >
                    Join Room
                </Button>
            </div>
            <div className="mt-8 max-w-md w-full text-center">
                <p className="text-zinc-400 text-sm font-medium text-center select-none">
                    People in this room will see your name and profile photo.
                </p>
            </div>
        </div>
    )
}

export default JoinRoom
