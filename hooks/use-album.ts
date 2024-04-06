import useSWR from "swr";
import fetcher from "@/lib/fetcher";

export const useAlbum = (url : string) => {
    
    const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
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