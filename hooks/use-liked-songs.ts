import useSWR from "swr";
import fetcher from "@/lib/fetcher";


export const useLikedSongs = () => {

    const { data, error, isLoading, mutate } = useSWR("/api/v1/user/liked-music", fetcher, {
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