import { Ad } from "@prisma/client"
import Image from "next/image"

interface AdInfoProps {
    ad : Ad|null;
}

export const AdInfo = ({ ad } : AdInfoProps) => {

    if (!ad) {
        return null;
    }

    return (
        <div className="w-full h-full flex items-center gap-x-4">
            <div className="relative aspect-square h-full rounded-sm overflow-hidden">
                <Image
                    src={ad.image}
                    alt="Ad"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="w-full flex-1 space-y-0 select-none flex items-center">
                <h3 className="line-clamp-1 font-medium text-sm md:text-base py-0 my-0">{ad.name}</h3>
            </div>
        </div>
    )
}
