import useSWR from "swr";
import fetcher from "@/lib/fetcher";

export const useTopSongs = () => {
    const { data, error, isLoading, mutate } = useSWR("/api/v1/views", fetcher, {
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