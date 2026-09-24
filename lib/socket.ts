import { io, Socket } from "socket.io-client";

const ACK_TIMEOUT_MS = 20000;
const TOKEN_REFRESH_MARGIN_MS = 5 * 60 * 1000;

let socket: Socket | null = null;
let cachedToken: { token: string; expiresAt: number } | null = null;
let retriedAfterUnauthorized = false;
const connectHandlers = new Set<() => void>();

export const fetchRealtimeToken = async (force = false): Promise<string> => {
    if (!force && cachedToken && cachedToken.expiresAt - Date.now() > TOKEN_REFRESH_MARGIN_MS) {
        return cachedToken.token;
    }
    const response = await fetch("/api/v1/realtime/token", { cache: "no-store" });
    if (!response.ok) {
        throw new Error("Could not get a realtime token");
    }
    cachedToken = await response.json();
    return cachedToken!.token;
};

export const socketInstance = () => {
    if (!socket) {
        socket = io(`${process.env.NEXT_PUBLIC_SOCKET_API}/v2`, {
            autoConnect: false,
            transports: ["websocket"],
            auth: (callback) => {
                fetchRealtimeToken()
                    .then((token) => callback({ token }))
                    .catch(() => callback({}));
            },
        });

        socket.on("connect", () => {
            retriedAfterUnauthorized = false;
            connectHandlers.forEach((handler) => handler());
        });

        socket.on("connect_error", (error) => {
            if (error.message !== "unauthorized" || retriedAfterUnauthorized) return;
            retriedAfterUnauthorized = true;
            cachedToken = null;
            socket?.connect();
        });
    }

    return socket;
}

export const connectSocket = () => {
    const active = socketInstance();
    if (!active.connected && !active.active) {
        active.connect();
    }
}

export const disconnectSocket = () => {
    socket?.disconnect();
    cachedToken = null;
}

export const refreshSocketAuth = async () => {
    if (!socket?.connected) return;
    const token = await fetchRealtimeToken(true);
    socket.emit("auth:refresh", { token });
}

export const onSocketConnect = (handler: () => void) => {
    connectHandlers.add(handler);
    return () => {
        connectHandlers.delete(handler);
    };
}

export const requestSocket = async <T>(event: string, payload: Record<string, unknown> = {}): Promise<T> => {
    const active = socketInstance();
    if (!active.connected) {
        connectSocket();
        await new Promise<void>((resolve, reject) => {
            const timer = setTimeout(() => {
                active.off("connect", onConnect);
                reject(new Error("Can't reach the Jam server. Check your connection and try again."));
            }, ACK_TIMEOUT_MS);
            const onConnect = () => {
                clearTimeout(timer);
                resolve();
            };
            active.once("connect", onConnect);
        });
    }
    return active.timeout(ACK_TIMEOUT_MS).emitWithAck(event, payload) as Promise<T>;
}
