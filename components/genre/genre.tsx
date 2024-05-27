"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface GenreProps { 
    id : string
    name : string,
    image : string
}

export const Genre = ({
    id,
    name,
    image
} : GenreProps ) => {

    const router = useRouter();

    return (
        <div
            className='w-full p-3 md:p-4 bg-neutral-900 rounded-md space-y-4 hover:bg-neutral-800/70 transition-colors md:cursor-pointer'
            onClick={()=>router.push(`/browse/genre/${id}`)}
        >
            <div className='aspect-square w-full rounded-sm overflow-hidden relative'>
                <Image
                    src={image}
                    alt="Img"
                    fill
                    className="object-fill"
                />
            </div>
            <div className="text-base font-medium select-none">
                {name}
            </div>
        </div>
    )
}
