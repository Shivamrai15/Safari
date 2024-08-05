import Image from "next/image"


export const Error = () => {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="max-w-sm w-full aspect-square relative">
                <Image
                    src="/assets/Error.svg"
                    alt="Error"
                    fill
                    className="object-contain"
                />
            </div>
        </div>
    )
}
