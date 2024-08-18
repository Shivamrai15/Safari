
import { Skeleton } from '@/components/ui/skeleton';

export const ArtistCardSkeleton = () => {
    return (
        <div className='aspect-[3/4] w-44 md:w-48 shrink-0 rounded-md space-y-4 bg-neutral-900 p-4'>
            <Skeleton className="aspect-[15/16] w-full rounded-full relative shrink-0 bg-neutral-800" />
            <Skeleton className="h-4 w-20 bg-neutral-800"/>
        </div>
    )
}
