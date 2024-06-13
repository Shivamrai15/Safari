import Image from 'next/image';

interface ProfileProps {
    image : string;
    about : string;
}

export const Profile = ({
    image,
    about
} : ProfileProps) => {
    return (
        <div className='max-w-2xl w-full p-8 relative rounded-lg bg-neutral-800 space-y-10 hover:scale-105 transition-all duration-500'>
            <div className='relative shadow-neutral-900 shadow-xl aspect-square w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden z-10'>
                <Image
                    src={image}
                    fill
                    alt='Artist'
                    className='object-cover select-none'
                />
            </div>
            <p className='line-clamp-4 text-zinc-200 text-base font-medium select-none'>
                {about}
            </p>
        </div>
    )
}
