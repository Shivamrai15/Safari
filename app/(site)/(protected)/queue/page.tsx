"use client"

import { useRouter } from "next/navigation"
import { useQueue } from "@/hooks/use-queue";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult
} from "@hello-pangea/dnd";
import { ArrowLeft } from "lucide-react"
import { PlayerSongInfo } from "@/components/utils/player-song-info";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DeleteMiniModal } from "@/components/queue/delete-mini-modal";

const QueuePage = () => {

    const router = useRouter();
    const { current, queue, replace } = useQueue();
    const [ select, setSelect ] = useState<string[]>([]);
    const [open, setOpen] = useState(false)


    const handleDragEnd = (e : DropResult ) => {
        const {destination, draggableId, source} = e;
        if (!destination){
            return ;
        }
        if ( destination.index === source.index && destination.droppableId === source.droppableId ) {
            return;
        }
        replace(draggableId, source.index, destination.index);
    }


    useEffect(()=>{
        if (select.length > 0) {
            setOpen(true);
        }
    }, [open]);


    return (
        <main className="md:hidden h-full overflow-y-auto w-full relative">
            <DeleteMiniModal
                open = {open}
                ids = {select}
                close = {()=>{
                    setSelect([]);
                    setOpen(false);
                }}
            />
            <header className="w-full p-6 flex items-center justify-start sticky top-0 bg-neutral-950 z-30">
                <button onClick={()=>router.back()} >
                    <ArrowLeft/>
                </button> 
            </header>
            <section className="px-6 w-full space-y-8 pb-20">
                <div className="w-full space-y-4">
                    <h1 className="font-semibold px-1">Now Playing</h1>
                    <div className="h-10 px-1">
                        <PlayerSongInfo song={current} />
                    </div>
                </div>
                <div className="w-full space-y-4">
                    <h1 className="font-semibold px-1">Upcoming</h1>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="lists" >
                            {(provided)=>(
                                <ul
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="w-full"
                                >
                                    {
                                        queue.slice(1).map((song, index)=>(
                                            <Draggable draggableId={song.id}  key={song.id} index={index+1}  >
                                                {(provided)=>(
                                                    <li
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                        role="button"
                                                        className={cn(
                                                            "h-14 w-full py-2 px-1 rounded-sm",
                                                            select.includes(song.id) && "bg-violet-500/40"
                                                        )}
                                                        onClick={(e)=>{
                                                            e.stopPropagation();
                                                            if ( select.includes(song.id) ) {
                                                                if ( select.length === 1 ) {
                                                                    setSelect((prev)=>prev.filter((id)=> id!==song.id));
                                                                    setOpen(false);
                                                                } else {
                                                                    setSelect((prev)=>prev.filter((id)=> id!==song.id));
                                                                }
                                                            } else {
                                                                setSelect((prev)=>[...prev, song.id])
                                                            }
                                                        }}
                                                    >
                                                       <PlayerSongInfo song={song} /> 
                                                    </li>
                                                )}
                                            </Draggable>   
                                        ))
                                    }
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </section>
        </main>
    )
}

export default QueuePage