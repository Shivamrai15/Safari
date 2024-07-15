import { useMemo } from "react";
import { socketInstance } from "@/lib/socket";

export const useSocket = () => {
    const socket = useMemo(() => socketInstance(), []);
    return socket;
};