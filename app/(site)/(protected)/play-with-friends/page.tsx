"use client";

import { Connections } from "@/components/socket/connections";
import { CreateRoomCard } from "@/components/socket/create-room-card";
import { useAccount } from "@/hooks/use-account";
import { useRouter } from "next/navigation";

const PlayWithFriendsPage = () => {

    const router = useRouter();
    const { data , isLoading } : { 
        data : { 
            name: string | null,
            id: string,
            privateSession: boolean,
            isActive : boolean
        },
        isLoading: boolean,
    } = useAccount();

    if ( !isLoading && !data.isActive ){
        router.push("/");
        return null;
    }
    
    return (
        <main className="w-full px-6 md:px-14 lg:px-20 pb-20 md:pb-10 pt-10 md:pt-20">
            <div className="md:pr-32 space-y-16">
                <CreateRoomCard/>
                <Connections/>
            </div>
        </main>
    )
}

export default PlayWithFriendsPage;