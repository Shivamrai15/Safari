import { AlbumCarousel } from "@/components/album/album-carousel";
import { Header } from "@/components/header";

const HomePage = () => {
    return (
        <div className="space-y-12 md:space-y-16 mb-10">
            <Header/>
            <div className="px-4 md:px-10 w-full mt-20 space-y-10 md:space-y-16">
                <AlbumCarousel label="New Releases" href="/api/v1/new-releases" />
                <AlbumCarousel label="Recommended Albums" href="/api/v1/recommended" />
            </div>
        </div>
    );
}

export default HomePage;