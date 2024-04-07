import { Header } from "@/components/album/header";
import { SongsList } from "@/components/song/songs-list";
import { getAlbum } from "@/server/album"
import { redirect } from "next/navigation";

interface AlbumPageProps  {
    params : { albumId : string }
}

const AlbumPage = async({
    params
} : AlbumPageProps ) => {

    const album = await getAlbum(params.albumId);

    if (!album) {
        redirect("/");
    }

    return (
        <div className="min-h-full " style={{background :  `linear-gradient(180deg, #111 70%,  ${album.color}5a 100%)` }}  >
            <Header
                color = {album.color}
                name = {album.name}
                image = {album.image}
                length = { album.songs.reduce((value, song) => {
                   return value + song.duration
                }, 0)}
                songs = {album.songs.length}
                release = {album.release}
            />
            <SongsList songs = { album.songs } />
        </div>
    )
}

export default AlbumPage