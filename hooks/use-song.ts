"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

interface UseSongQueryProps {
    id: string
    queryKey: string
}

export const useSongQuery = ({
    id,
    queryKey
}: UseSongQueryProps) => {

    const fetchSongs = async ({ pageParam = undefined }) => {
        const url = qs.stringifyUrl({
            url: '/api/v1/artist/songs',
            query: {
                cursor: pageParam,
                id
            }
        }, {
            skipNull: true
        });

        const res = await fetch(url);
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