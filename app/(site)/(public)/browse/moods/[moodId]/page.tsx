import React, { Suspense } from 'react';
import { getMoodById } from '@/server/mood';

import { Error } from '@/components/utils/error';
import { Loader } from '@/components/utils/loader';
import { Metadata, ResolvingMetadata } from 'next';
import { Header } from '@/components/mood/header';
import { Songs } from '@/components/mood/songs';


interface MoodPageProps {
    params : {
        moodId : string
    }
}

export async function generateMetadata(
    { params } : MoodPageProps,
    parent : ResolvingMetadata
) : Promise<Metadata> {
    
    const data = await getMoodById(params.moodId);
    const previousImages = (await parent).openGraph?.images || [];
    
    if ( !data ) {
        return {};
    }

    return {
        title: `${data.name} | Safari`,
        description : "",
        openGraph: {
            images: [{
                url : data.image??"",
                height : 1200,
                width : 1200
            }, ...previousImages],
            type : "music.album",
        },
        twitter : {
            card: 'summary_large_image',
            title: `${data.name} | Safari`,
            description : "",
            images: [{
                url : data.image??"",
                height : 1200,
                width : 1200
            }], 
        },
        category : "music streaming",
        appLinks : {
            android : {
                package : "com.shivamrai6836.Safari",
                app_name : "Safari",
                url : "safarimusic://mood-songs/" + params.moodId
            }, 
        },
        other: {
            "al:android:url": "safarimusic://mood-songs/" + params.moodId,
            "al:android:package": "com.shivamrai6836.Safari",
            "al:android:app_name": "Safari",    
        }
    }
}

const MoodPage = async({
    params
}: MoodPageProps) => {
 
    return (
        <Suspense fallback={<Loader className='h-full w-full' />} >
            <ServerComponent moodId={params.moodId} />
        </Suspense>
    )
}

export default MoodPage;


async function ServerComponent({ moodId } : { moodId : string }) {
    
    const mood = await getMoodById(moodId);
    if ( !mood ) {
        return (
            <Error />
        )
    }

    return (
        <main className="min-h-full pb-20 bg-[#111]" >
            <Header mood={mood}  />
            <Songs moodId={mood.id} />
        </main>
    )
}
