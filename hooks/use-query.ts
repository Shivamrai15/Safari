"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

interface UseSongQueryProps {
    url : string
    paramKey: string
    paramValue : string
    queryKey: string
}

export const useQuery = ({
    url,
    paramKey,
    paramValue,
    queryKey
}: UseSongQueryProps) => {

    const fetchSongs = async ({ pageParam = undefined }) => {
        const fetch_url = qs.stringifyUrl({
            url,
            query: {
                cursor: pageParam,
                [paramKey] : paramValue
            }
        }, {
            skipNull: true
        });

        const res = await fetch(fetch_url, {cache : "no-store"});
        return res.json();
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        initialPageParam: undefined,
        queryKey: [queryKey],
        queryFn: fetchSongs,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: false,
    });

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    }
}