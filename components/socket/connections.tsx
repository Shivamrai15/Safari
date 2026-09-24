"use client";

import { useJam } from "@/hooks/use-jam";
import { sendJamCommand } from "@/lib/jam";
import UserCard from "./user-card";


export const Connections = () => {

    const state = useJam((store) => store.state);
    const userId = useJam((store) => store.userId);

    if (!state) {
        return null;
    }

    const isHost = state.hostId === userId;

    return (
        <div className="max-w-4xl w-full space-y-6 mx-auto">
            <h2 className="text-lg md:text-2xl font-semibold select-none" >People in this Jam</h2>
            <ul className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" >
                {state.members.map((member) => (
                    <UserCard
                        key={member.userId}
                        user={member}
                        label={member.userId === state.hostId ? "Host" : member.userId === userId ? "You" : undefined}
                    >
                        {
                            isHost && member.userId !== userId && (
                                <div className="flex sm:justify-center gap-3 text-xs">
                                    <button
                                        className="text-zinc-300 hover:text-white"
                                        onClick={() => sendJamCommand({ type: "TRANSFER_HOST", userId: member.userId })}
                                    >
                                        Make host
                                    </button>
                                    <button
                                        className="text-red-400 hover:text-red-300"
                                        onClick={() => sendJamCommand({ type: "KICK", userId: member.userId })}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )
                        }
                    </UserCard>
                ))}
            </ul>
        </div>
    )
}
