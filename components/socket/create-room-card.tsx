"use client";

import { useSearchParams } from "next/navigation";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";

import { useSocket } from "@/hooks/use-socket";
import { useSocketEvents } from "@/hooks/use-socket-events";

import axios from "axios";
import JoinRoom from "./join-room";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { END_ROOM, JOIN_ROOM, LEAVE_ROOM } from "@/lib/events";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RoomUser } from "@/types";
import { Loader } from "@/components/utils/loader";


export const CreateRoomCard = () => {

    const searchParams = useSearchParams();
    const roomIdParam = searchParams.get("room");
    const queryClient = useQueryClient();

    const socket = useSocket();
    const session = useSession();
    const { connected, currentUser, roomId } = useSocketEvents();


    const handleJoinRoom = ( roomId: string, isHost: boolean ) => {
        socket.emit(JOIN_ROOM, { 
            name : session.data?.user?.name|| "",
            email : session.data?.user?.email|| "",
            roomId,
            isHost,
            image : session.data?.user?.image
        });
    }

    const handleLeaveRoom = () => {
        socket.emit(LEAVE_ROOM);
        queryClient.invalidateQueries({
            queryKey : ["room", roomId]
        });
    }

    const handleEndRoom = () => {
        socket.emit(END_ROOM, {roomId});
    }

    const { data, isPending } : { data : { roomId: string, users: RoomUser[] }|undefined|null, isPending: boolean } = useQuery({
        queryFn : async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_SOCKET_API}/api/v1/room/${roomIdParam}`);
            return res.data;
        },
        queryKey : ["room", roomIdParam],
        enabled : !!roomIdParam
    })


    return (
        <div className="w-full overflow-hidden relative bg-gradient-to-b from-neutral-950/80 bg-neutral-900/60 max-w-4xl mx-auto rounded-3xl">
            <svg className="pointer-events-none absolute inset-[unset] text-zinc-900 [mask-image:linear-gradient(transparent,black_40%)]" width="100%" height="100%"><defs><pattern id="grid-«r1c»" x="-1" y="-1" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 80 0 L 0 0 0 80" fill="transparent" stroke="currentColor" strokeWidth="1"></path></pattern></defs><rect fill="url(#grid-«r1c»)" width="100%" height="100%"></rect></svg>
            <div className="w-full p-6 space-y-10 z-10 relative">
                <div className="pt-10 space-y-8">
                    <h1 className="text-center text-xl font-semibold md:text-4xl select-none">Start a group session</h1>
                    <p className="max-w-xl w-full text-center text-zinc-300 mx-auto select-none">Create a room, invite friends, and simultaneously listen to shared playlists, fostering real-time musical connection.</p>
                </div>
                <div className="flex items-center justify-center">
                    {
                        !connected && !roomIdParam ? (
                            <Button
                                className="rounded-full select-none"
                                variant="secondary"
                                size="sm"
                                onClick={()=>handleJoinRoom(nanoid(), true)}
                            >
                                Create Room
                            </Button>
                            
                        ) : (
                            !connected && roomIdParam && isPending ? (
                                <div className="w-full flex items-center justify-between py-4">
                                    <Loader/>
                                </div>
                            ) : !connected && roomIdParam && data ? (
                                <JoinRoom
                                    joinRoom={handleJoinRoom}
                                    roomId={data.roomId}
                                    users={data.users}                         
                                />
                            )
                            : (
                                <div className="flex items-center justify-center gap-x-4">
                                    <Button
                                        className="rounded-full select-none"
                                        size="sm"
                                        onClick={async()=>{
                                            await navigator.share({
                                                title : "Listen with your friends",
                                                url : `/listen-with-friends?room=${roomId}`
                                            })
                                        }}
                                    >
                                        Invite Friends
                                    </Button>
                                    <Button
                                        className="rounded-full select-none"
                                        variant="secondary"
                                        size="sm"
                                        onClick={()=>{
                                            if (currentUser?.isHost) {
                                                handleEndRoom();
                                            } else {
                                                handleLeaveRoom();
                                            }
                                        }}
                                    >
                                        { currentUser?.isHost ? "End Room" : "Leave Room" }
                                    </Button> 
                                </div>
                            )
                        )
                    }
                </div>
            </div>
            <div className="absolute top-0 right-0">
                <div className="p-4 flex items-center justify-center gap-x-2">
                    <div className={cn(
                        "size-3 animate-pulse bg-neutral-500 rounded-full",
                        connected && "bg-green-500"
                    )} />
                    <h4 className="text-sm font-medium text-zinc-300 select-none">
                        { connected ? "Connected" : "Disconnected" }
                    </h4>
                </div>
            </div>
        </div>
    )
}