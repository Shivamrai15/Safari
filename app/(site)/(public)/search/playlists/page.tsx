import PlaylistCards from "@/components/playlist/playlist-cards";
import { SavedPlaylistCard } from "@/components/playlist/saved-playlist-card";
import { getPlaylistSearches } from "@/server/search";

interface PlaylistsSearchPageProps { 
    searchParams : {
        query : string
    };
}

const PlaylistSearchPage = async({
    searchParams
} : PlaylistsSearchPageProps ) => {

    if (!searchParams.query)
        return null;

    const responses = await getPlaylistSearches(searchParams.query);

    if (!responses){
        return (
            <div className="w-full h-full flex items-center justify-center pt-32">
                <h4 className="font-semibold md:text-lg text-center text-zinc-300">No albums found for &quot;{searchParams.query}&quot;</h4>
            </div>
        )
    }

    const playlists = responses.map((playlist)=>playlist.item);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 gap-y-8 md:gap-10 md:gap-y-8 lg:gap-y-16 py-10">
            {
                playlists.map((playlist)=>(
                    <SavedPlaylistCard
                        key={playlist.id}
                        name={playlist.name}
                        image={playlist?.image || "/assets/playlist.png"}
                        url={`/playlists/${playlist.id}`}
                    />
                ))
            }
        </div>
    )
}

export default PlaylistSearchPage