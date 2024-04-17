"use client";

import qs from "query-string";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchTab } from "@/components/search/search-tab";
import { SearchTabCarousel } from "@/components/search/search-tabs-carousel";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchForm = () => {

    const router = useRouter();
    const pathname = usePathname();

    const [ query, setQuery ] = useState("");
    const debounceValue = useDebounce(query, 500);

    const routes = useMemo(()=>[
        {
            label : "All",
            url : "/search",
            active : pathname === "/search" 
        },
        {
            label : "Albums",
            url : "/search/albums",
            active : pathname === "/search/albums"
        },
        {
            label : "Songs",
            url : "/search/songs",
            active : pathname === "/search/songs"
        },
        {
            label : "Artists",
            url : "/search/artists",
            active : pathname === "/search/artists"
        },
        {
            label : "Playlists",
            url : "/search/playlists",
            active : pathname === "/search/playlists"
        }
    ], [pathname]);

    useEffect(()=>{
        
        const url = qs.stringifyUrl({
            url : pathname,
            query : {
                query : debounceValue
            }
        });

        router.push(url);

    }, [debounceValue, router])

    
    return (
        <div className="flex flex-col gap-10">
            <div className="h-14 w-full max-w-md bg-neutral-800 rounded-full flex items-center px-4">
                <Search/>
                <Input
                    className="bg-neutral-800 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 font-medium text-base text-zinc-300"
                    placeholder="Search songs, albums, artists"
                    value={query}
                    onChange={(e)=>setQuery(e.target.value)}
                />
            </div>
            {
                query && (
                    <>
                        <div className="sm:flex items-center gap-x-4 hidden">
                            {
                                routes.map((tab)=>(
                                    <SearchTab
                                        key={tab.url}
                                        label={tab.label}
                                        url={tab.url}
                                        active = {tab.active}
                                    />
                                ))
                            }
                        </div>
                        <div className="sm:hidden">
                            <SearchTabCarousel routes={routes} />  
                        </div>
                    </>
                )
            }
        </div>
    )
}
