import useSWR from "swr";
import fetcher from "@/lib/fetcher";

export const useGenre = () => {
    const { data, error, isLoading, mutate } = useSWR("/api/v1/genre", fetcher, {
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