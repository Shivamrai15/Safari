import useSWR from "swr";
import fetcher from "@/lib/fetcher";


export const useListenAgain = () => {

    const { data, error, isLoading, mutate } = useSWR("/api/v1/user/listen-again", fetcher, {
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