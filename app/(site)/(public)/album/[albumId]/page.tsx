import { Metadata, ResolvingMetadata } from "next";

import { Header } from "@/components/album/header";
import { SongsList } from "@/components/song/songs-list";
import { getAlbum, getAlbums } from "@/server/album";
import { albumMetaData } from "@/server/meta";
import { Error } from "@/components/utils/error";

interface AlbumPageProps  {
    params : { albumId : string }
}

export async function generateStaticParams(){
    const albums = await getAlbums();
    return albums.map(album => ({ albumId: album.id }));
}

export async function generateMetadata(
    { params } : AlbumPageProps,
    parent : ResolvingMetadata
) : Promise<Metadata> {

    const data = await albumMetaData(params.albumId);
    const previousImages = (await parent).openGraph?.images || [];
    
    if ( !data ) {
        return {};
    }

    return {
        title: data.name,
        description: `${data._count.songs === 1 ? "Single" : "Album"} • ${data._count.songs} Songs • ${new Date(data.release).getFullYear()}`,
        openGraph: {
            images: [{
                url : data.image,
                height : 1200,
                width : 1200
            }, ...previousImages],
            type : "music.album",
        },
        twitter : {
            card: 'summary_large_image',
            title: data.name,
            description: `${data._count.songs === 1 ? "Single" : "Album"} • ${data._count.songs} Songs • ${new Date(data.release).getFullYear()}`,
            images: [{
                url : data.image,
                height : 1200,
                width : 1200
            }], 
        },
        category : "music streaming"
    }
}


const AlbumPage = async({
    params
} : AlbumPageProps ) => {

    const album = await getAlbum(params.albumId);

    if (!album) {
        return (
            <Error />
        )
    }

    return (
        <div className="min-h-full pb-10 md:pb-0" style={{background :  `linear-gradient(180deg, #111 70%,  ${album.color}5a 100%)` }}  >
            <Header
                id={album.id}
                color = {album.color}
                name = {album.name}
                image = {album.image}
                length = { album.songs.reduce((value, song) => {
                   return value + song.duration
                }, 0)}
                songs = {album.songs.length}
                release = {album.release}
                data={album.songs}
            />
            <div className="md:pr-28">
                <SongsList songs = { album.songs } />
            </div>
        </div>
    )
}

export default AlbumPage