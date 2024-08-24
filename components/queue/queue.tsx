"use client";

import Image from "next/image";
import Link from "next/link";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult
} from "@hello-pangea/dnd";
import {
    GripVertical,
    LibraryBig,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueue } from "@/hooks/use-queue";
import { FaRegPlayCircle } from "react-icons/fa";
import { cn, songLength } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Audio } from "react-loader-spinner";
import { usePlayer } from "@/hooks/use-player";
import { LikeButton } from "../utils/like-button";
import { useAccount } from "@/hooks/use-account";
import { useSocketEvents } from "@/hooks/use-socket-events";
import { useSocket } from "@/hooks/use-socket";
import { REMOVE, REPLACE, SHIFT_TOP } from "@/lib/events";

export const Queue = () => {

    const {
            queue,
            clear,
            replace,
            remove,
            shiftToTopOfQueue,
    } = useQueue();

    const socket = useSocket();
    const { connected, roomId } = useSocketEvents();
    const { data } : { 
        data : { 
            name: string | null,
            id: string,
            privateSession: boolean,
            isActive : boolean
        },
    } = useAccount();

    const { isPlaying } = usePlayer();

    const handleDragEnd = (e : DropResult ) => {
        const {destination, draggableId, source} = e;

        if (!destination){
            return ;
        }
         
        // if dropped at the same position
        if ( destination.index === source.index && destination.droppableId === source.droppableId ) {
            return;
        }

        if ( destination.index === 0 || source.index === 0 ){
            return;
        }
        replace(draggableId, source.index, destination.index);
        socket.emit(REPLACE, { roomId, id:draggableId , source:source.index, destination:destination.index });

    }

    return (
        <div className="hidden group md:block w-20 h-96 right-0 fixed top-[calc(50%-12rem)]  bg-neutral-800 z-40 rounded-l-md hover:w-96 transition-all duration-300 shadow-md">
            <div className="flex items-center justify-between h-16 p-4">
                <div className="w-20 group-hover:w-fit flex items-center justify-center">
                    <LibraryBig className="h-10 w-10 text-red-500"/>
                </div>
                <div className="hidden group-hover:flex">
                    <Button className="rounded-full px-6 font-semibold" onClick={clear} >
                        Clear
                    </Button>
                </div>
            </div>
            <Separator className="w-full bg-zinc-500 "/>
            <div className="w-full h-80 relative">
                
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="lists" >
                        {(provided)=>(
                            <ul
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="overflow-hidden group-hover:overflow-y-auto h-full queue-scroll"
                            >
                                {
                                    queue.map(( song, index )=>(
                                        <Draggable draggableId={song.id}  key={song.id} index={index} isDragDisabled = {index===0 || data?.isActive ===false}  >
                                            {(provided)=>(
                                                <li
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                    role="button"
                                                    onClick={()=>{
                                                            shiftToTopOfQueue(song.id);
                                                            if ( connected ) {
                                                                socket.emit(SHIFT_TOP, { roomId, id: song.id });
                                                            }
                                                        }
                                                    }
                                                    className={cn(
                                                        "flex z-[9999] items-center space-x-4 bg-neutral-800 hover:bg-neutral-900 focus:bg-neutral-900 px-4 py-2 transition-all cursor-default md:cursor-pointer select-none group/song",
                                                        index === 0 && "bg-neutral-900/80",
                                                        
                                                    )}
                                                >
                                                    <div className="w-12 aspect-square shrink-0 rounded-md relative overflow-hidden" >
                                                        <Image
                                                            src={song.image}
                                                            fill
                                                            alt={song.image}
                                                            className={cn(
                                                                "object-cover",
                                                                index === 0 && "brightness-50"
                                                            )}
                                                        />
                                                        {
                                                            (index === 0 ) && (
                                                                <div className="h-full w-full top-0 left-0 right-0 bottom-0 absolute flex items-center justify-center">
                                                                    {
                                                                        isPlaying ? <Audio color="#ef4444" height={35} /> : <FaRegPlayCircle className="h-8 w-8"/>
                                                                    }
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="w-full hidden group-hover:block shrink flex-1">
                                                        <h3 className="text-sm font-medium text-zinc-100 line-clamp-1" >{ song.name }</h3>
                                                        <div>
                                                            <Link
                                                                href={`/album/${song.albumId}`}
                                                                className="text-sm hover:underline w-fit transition-all line-clamp-1 text-zinc-300"
                                                                onClick={(e)=>e.stopPropagation()}
                                                            >
                                                                {song.album.name}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div className="items-center hidden group-hover:flex space-x-4">
                                                        <LikeButton className="h-6 w-6" id={song.id} />
                                                        <div className="text-sm">
                                                            {
                                                                songLength(song.duration)
                                                            }
                                                        </div>
                                                        <div className="w-6">
                                                            <GripVertical className={cn(
                                                                "h-6 w-6 group-hover/song:hidden text-zinc-500",
                                                                index === 0 && "group-hover/song:block"
                                                            )} />
                                                            <X
                                                                className={cn(
                                                                    "h-6 w-6 text-zinc-200 hidden group-hover/song:block",
                                                                    index === 0 && "group-hover/song:hidden"
                                                                )}
                                                                onClick={(e)=>{
                                                                    e.stopPropagation();
                                                                    remove(song.id);
                                                                    if ( connected ) {
                                                                        socket.emit(REMOVE, {roomId, id:song.id});
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </li>
                                            )}
                                        </Draggable>
                                        
                                    ))
                                }
                            {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                    
                </DragDropContext>
            </div>
        </div>
    )
}
