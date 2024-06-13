import { AlbumCarousel } from "@/components/album/album-carousel";
import { Header } from "@/components/header";
import PlaylistCards from "@/components/playlist/playlist-cards";
import { ListenAgain } from "@/components/song/listen-again";
import { TopSongsCarousel } from "@/components/song/top-songs-carousel";
import { Profile } from "@/components/utils/profile";

const HomePage = () => {
    return (
        <div className="space-y-12 md:space-y-16 mb-20 md:mb-10 md:pr-28 relative">
            <Header/>
            <div className="px-4 md:px-10 w-full mt-20 space-y-10 md:space-y-16">
                <Profile/>
                <PlaylistCards/>
                <ListenAgain/>
                <TopSongsCarousel/>
                <AlbumCarousel label="New Releases" href="/api/v1/new-releases" />
                <AlbumCarousel label="Recommended Albums" href="/api/v1/recommended" />
            </div>
        </div>
    );
}

export default HomePage;