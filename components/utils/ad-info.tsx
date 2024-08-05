import Image from "next/image"



export const AdInfo = () => {
    return (
        <div className="w-full h-full flex items-center gap-x-4">
            <div className="relative aspect-square h-full rounded-sm overflow-hidden">
                <Image
                    src="/assets/ad.avif"
                    alt="Ad"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="w-full flex-1 space-y-0 select-none flex items-center">
                <h3 className="line-clamp-1 font-medium text-sm md:text-base py-0 my-0">Safari Ad</h3>
            </div>
        </div>
    )
}
