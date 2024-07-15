import useSWR from "swr";
import fetcher from "@/lib/fetcher";

export const useGenre = () => {
    const { data, error, isLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_SOCKET_API}/api/v2/genre`, fetcher, {
        revalidateIfStale : false,
        revalidateOnFocus : false,
        revalidateOnReconnect : false
    });

    return {
        data,
        error,
        isLoading,
        mutate
    };
}