import { Header } from "@/components/album/liked-header";
import { LikedSongsList } from "@/components/song/liked-songs-list";
import { getLikedSongs } from "@/server/liked-tracks";
import { redirect } from "next/navigation";


const LikedMusicPage = async() => {

    const likedSongs = await getLikedSongs();

    if (!likedSongs) {
        return redirect("/");
    }

    return (
        <div className="min-h-full pb-10 md:pb-0 bg-gradient-to-b from-[#111] from-70% to-[#B207105a] to-100%">
            <Header/>
            <LikedSongsList likedSongs = {likedSongs} />
        </div>
    )
}

export default LikedMusicPage