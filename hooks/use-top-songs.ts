import useSWR from "swr";
import fetcher from "@/lib/fetcher";

export const useTopSongs = () => {
    const { data, error, isLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_SOCKET_API}/api/v2/song/most-played`, fetcher, {
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