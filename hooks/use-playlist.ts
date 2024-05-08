import useSWR from "swr";
import fetcher from "@/lib/fetcher";


export const usePlaylist = () => {

    const { data, error, isLoading, mutate } = useSWR("/api/v1/user/playlist", fetcher, {
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