"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";

import { useSocket } from "@/hooks/use-socket";
import { useSocketEvents } from "@/hooks/use-socket-events";

import { cn } from "@/lib/utils";
import { Rabbit } from 'lucide-react';
import { MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { END_ROOM, JOIN_ROOM, LEAVE_ROOM } from "@/lib/events";


export const CreateRoomCard = () => {

    const searchParams = useSearchParams();
    const roomIdParam = searchParams.get("room");

    const socket = useSocket();
    const session = useSession();
    const { connected, currentUser, roomId } = useSocketEvents();


    const onHandleJoin = ( roomId: string, isHost: boolean ) => {
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
    }

    const handleEndRoom = () => {
        socket.emit(END_ROOM, {roomId});
    }

    useEffect(()=>{
        if ( roomIdParam && !connected ) {
            onHandleJoin(roomIdParam, false);
        }
    }, [roomIdParam]);



    return (
        <header className={cn(
            "max-w-xl w-full p-6 py-8 md:py-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-800/20 to-neutral-900/80  rounded-lg md:rounded-3xl space-y-10 transition-all duration-700",
            connected && "from-emerald-800/20"
        )}>
            <div className="flex items-center gap-x-6">
                <MonitorSmartphone className="h-8 w-8 md:h-10 md:w-10" />
                <h2 className="text-2xl sm:text-2xl md:text-4xl font-bold" >
                    {
                        connected ? "Connected" : "Disconnected"
                    }
                </h2>
            </div>
            <Separator className="w-full bg-neutral-700"/>
            <div>
                {
                    connected ? (
                        <div className="flex items-center space-x-4">
                            <Button
                                className="bg-transparent border-2 border-zinc-600 rounded-full"
                                variant="outline"
                                size="lg"
                                onClick={async()=>{
                                    await navigator.share({
                                        title : "Listen with your friends",
                                        url : `/listen-with-friends?room=${roomId}`
                                    })
                                }}
                            >
                                Invite
                            </Button>
                            {
                                currentUser?.isHost ? (
                                    <Button
                                        className="bg-transparent border-2 border-zinc-600 rounded-full"
                                        variant="outline"
                                        size="lg"
                                        onClick={handleEndRoom}
                                    >
                                        End
                                    </Button>
                                ) : (
                                    <Button
                                        className="bg-transparent border-2 border-zinc-600 rounded-full"
                                        variant="outline"
                                        size="lg"
                                        onClick={handleLeaveRoom}
                                    >
                                        Leave
                                    </Button>
                                )
                            }
                        </div>
                    ) : (
                        <Button 
                            className="h-12 px-8 rounded-full bg-red-600 hover:bg-red-600/80 text-white font-semibold text-base"
                            onClick={()=>onHandleJoin(nanoid(), true)}
                        >
                            <Rabbit className="h-6 w-6 mr-3" />
                            Create Room
                        </Button>
                    )
                }
            </div>
        </header>
    )
}