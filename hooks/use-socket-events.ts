import { create } from "zustand";
import { User } from "@/types";


interface SocketEventsProps {
    currentUser : User|undefined,
    connected : boolean;
    roomId : string;
    remainingUsers : User[]
    setCurrentUser : (user: User|undefined) => void;
    setRommId : (roomId: string) => void;
    setRemainingUsers : (users: User[]) => void;
    setConnected : (connected: boolean) => void; 
    reset : ()=>void;
}


export const useSocketEvents = create<SocketEventsProps>((set, get)=>({
    currentUser : undefined,
    roomId : "",
    remainingUsers : [],
    connected : false,
    setCurrentUser : ( user: User|undefined ) => set({ currentUser: user }),
    setRommId : ( roomId: string ) => set({ roomId }),
    setRemainingUsers : ( users: User[] ) => set({ remainingUsers : users }),
    setConnected : ( connected: boolean ) => set({connected}),
    reset : () => set({ currentUser:undefined, roomId:"", remainingUsers:[], connected:false })
}));