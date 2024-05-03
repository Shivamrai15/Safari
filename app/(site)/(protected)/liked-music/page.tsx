import { Header } from "@/components/album/liked-header";
import { LikedSongsList } from "@/components/song/liked-songs-list";

const LikedMusicPage = () => {
    return (
        <div className="min-h-full pb-10 md:pb-0 bg-gradient-to-b from-[#111] from-70% to-[#B207105a] to-100%">
            <Header/>
            <LikedSongsList/>
        </div>
    )
}

export default LikedMusicPage