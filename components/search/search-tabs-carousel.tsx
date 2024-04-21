"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel";
import { SearchTab } from "./search-tab";

interface SearchTabCarouselProps {
    routes : {
        label : string,
        url : string,
        active : boolean
    }[];
    query : string;
}

export const SearchTabCarousel = ({
    routes,
    query
} : SearchTabCarouselProps ) => {   
    
    return (
        <Carousel
            opts = {{
                align : "start",
                slidesToScroll : "auto"
            }}
        >
            <CarouselContent className="space-x-0 shrink-0">
                {
                    routes.map((route)=>(
                        <CarouselItem key={route.url} className="basis-auto" >
                            <SearchTab label={route.label} url={route.url} query={query} active={route.active} />
                        </CarouselItem>
                    ))
                }
            </CarouselContent>
        </Carousel>
    )
}
