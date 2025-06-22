"use client";
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';

const BrowseButtons = () => {

    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className='flex items-center gap-4'>
            <Button 
                className='rounded-full text-base font-semibold'
                variant={pathname === '/browse' ? 'default' : 'secondary'}
                onClick={() => router.push('/browse')}
            >
                Genre
            </Button>
            <Button
                className='rounded-full text-base font-semibold'
                variant={pathname === '/browse/moods' ? 'default' : 'secondary'}
                onClick={() => router.push('/browse/moods')}
            >
                Moods
            </Button>
        </div>
    )
}

export default BrowseButtons
