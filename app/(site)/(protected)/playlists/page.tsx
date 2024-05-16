import { Followings } from "@/components/playlist/followings";
import { SavedPalylists } from "@/components/playlist/saved-playlists";

const PlaylistsPage = () => {
    return (
        <main className="px-6 md:px-14 lg:px-20 pb-20 md:pb-10 pt-10 md:pt-20 space-y-16 md:pr-32">
            <div className="space-y-10">
                <header className="flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl font-extrabold">Your Library</h1>
                </header>
                <SavedPalylists/>
            </div>
            <Followings/>
        </main>
    )
}

export default PlaylistsPage;