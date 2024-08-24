"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/hooks/use-socket";
import { useSocketEvents } from "@/hooks/use-socket-events";
import { User } from "@/types";
import {
    POP,
    PUSH,
    CLEAR,
    REMOVE,
    DEQUEUE,
    ENQUEUE,
    REPLACE,
    PLAYNEXT,
    SHIFT_TOP,
    LEAVE_ROOM,
    UPDATE_USER,
    PRIORITY_ENQUEUE,
    END_ROOM,
} from "@/lib/events";

import { useQueue } from "@/hooks/use-queue";
import { Album, Song } from "@prisma/client";


export const SocketProvider = ()=> {

    const session = useSession();
    const socket = useSocket();

    const {
        reset,
        setRommId,
        setConnected,
        setCurrentUser,
        setRemainingUsers,
    } = useSocketEvents();

    const {
        pop,
        push,
        clear,
        remove,
        replace,
        enQueue,
        deQueue,
        playNext,
        priorityEnqueue,
        shiftToTopOfQueue,
    } = useQueue();

    useEffect(()=>{

        const handleRoomCreated = ( users: User[], roomId : string )=> {
            const currentUser = users.find((user)=>user.email===session.data?.user?.email);
            const remainingUsers = users.filter((user)=>user.email!==session.data?.user?.email);
            setCurrentUser(currentUser);
            setRemainingUsers(remainingUsers);
            setRommId(roomId);
            setConnected(true);
        }

        const handleLeaveRoom = () => {
            reset();
        }

        const handleEnqueueEvent = (payload:{ roomId: string, songs : ( Song & { album : Album } )[], clear?: boolean }) => {
            enQueue(payload.songs, payload.clear);
        }

        const handleDequeueEvent = () => {
            deQueue();
        }

        const handlePushEvent = (payload: { roomId: string, song: ( Song & { album: Album } ) }) => {
            push(payload.song);
        }

        const handlePopEvents = () => {
            pop()
        }

        const handlePriorityEnqueueEvent = (payload: { roomId:string, songs: ( Song & { album: Album } )[] }) => {
            priorityEnqueue(payload.songs);
        }

        const handleClearEvent = () => {
            clear();
        }

        const handleShiftToTopOfQueueEvent = (payload: { roomId: string, id: string }) => {
            shiftToTopOfQueue(payload.id);
        }

        const handleReplaceEvent = (payload: { roomId: string, id : string, source : number, destination : number }) => {
            replace(payload.id, payload.source, payload.destination);
        }

        const handleRemoveEvent = (payload: { roomId: string, id: string }) => {
            remove(payload.id);
        }

        const handlePlayNext = (payload: { roomId: string, song: ( Song & { album: Album }) }) => {
            playNext(payload.song);
        }

        socket.on(POP, handlePopEvents);
        socket.on(PUSH, handlePushEvent);
        socket.on(LEAVE_ROOM, handleLeaveRoom);
        socket.on(ENQUEUE, handleEnqueueEvent);
        socket.on(DEQUEUE, handleDequeueEvent);
        socket.on(CLEAR, handleClearEvent);
        socket.on(UPDATE_USER, handleRoomCreated);
        socket.on(PRIORITY_ENQUEUE, handlePriorityEnqueueEvent);
        socket.on(SHIFT_TOP, handleShiftToTopOfQueueEvent);
        socket.on(REPLACE, handleReplaceEvent);
        socket.on(REMOVE, handleRemoveEvent);
        socket.on(PLAYNEXT, handlePlayNext);

        return () => {
            socket.off(POP, handlePopEvents);
            socket.off(CLEAR, handleClearEvent);
            socket.off(UPDATE_USER, handleRoomCreated);
            socket.off(LEAVE_ROOM, handleLeaveRoom);
            socket.off(ENQUEUE, handleEnqueueEvent);
            socket.off(DEQUEUE, handleDequeueEvent);
            socket.off(PRIORITY_ENQUEUE, handlePriorityEnqueueEvent);
            socket.off(SHIFT_TOP, handleShiftToTopOfQueueEvent);
            socket.off(REPLACE, handleReplaceEvent);
            socket.off(REMOVE, handleRemoveEvent);
            socket.off(PLAYNEXT, handlePlayNext);
        }

    }, []);

    return null;
}