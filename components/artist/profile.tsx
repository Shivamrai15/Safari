"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArtistDescriptionModal } from './about-modal';
import axios from 'axios';

interface ProfileProps {
    id: string;
    name : string;
    image : string;
    about : string;
}

export const Profile = ({
    id,
    name,
    about,
    image,
} : ProfileProps) => {

    const [isOpen, setIsOpen] = useState(false);
    const [views, setViews] = useState(0);

    const fetchViews = async()=>{
        try {

            const response = await axios.get(`${process.env.NEXT_PUBLIC_SOCKET_API}/api/v2/artist/views?id=${id}`);
            if ( response.status == 200 ){
                const artistViews:number = response.data['views']
                setViews(artistViews);
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchViews();
    }, [id]);

    return (
        <>
            <div onClick={()=>setIsOpen(true)} className='max-w-2xl w-full p-8 relative rounded-lg bg-neutral-800 space-y-10 hover:scale-105 transition-all duration-500'>
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
            <ArtistDescriptionModal
                name={name}
                about={about}
                views= {views}
                isOpen={isOpen}
                onClose={()=>setIsOpen(false)}
            />
        </>
    )
}
