"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useJam } from "@/hooks/use-jam";
import { applyJamState, installJamListeners, setJamProfile } from "@/lib/jam";
import { connectSocket, disconnectSocket, refreshSocketAuth } from "@/lib/socket";

const TOKEN_REFRESH_INTERVAL_MS = 50 * 60 * 1000;

export const SocketProvider = () => {

    const session = useSession();
    const userId = session.data?.user?.id ?? null;
    const name = session.data?.user?.name ?? null;
    const image = session.data?.user?.image ?? null;

    useEffect(() => {
        setJamProfile({ name, image });
    }, [name, image]);

    useEffect(() => {
        useJam.getState().setUserId(userId);

        if (!userId) {
            applyJamState(null);
            disconnectSocket();
            return;
        }

        installJamListeners();
        connectSocket();

        const interval = setInterval(() => {
            refreshSocketAuth().catch(() => undefined);
        }, TOKEN_REFRESH_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [userId]);

    return null;
}
