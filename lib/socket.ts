import { io, Socket } from "socket.io-client";

let socket: Socket|null = null;

export const socketInstance = ()=>{
    if ( !socket ) {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_API!);
    }

    return socket;
}