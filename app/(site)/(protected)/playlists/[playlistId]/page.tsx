import { auth } from "@/auth";
import { Header } from "@/components/playlist/header";
import { Songs } from "@/components/playlist/songs";
import { getPlaylistById } from "@/server/playlist"
import { redirect } from "next/navigation";

interface PlaylistPageProps  {
    params : { playlistId : string }
}

const PlaylistPage = async ({
    params
} : PlaylistPageProps ) => {

    const playlist = await getPlaylistById(params.playlistId);

    if (!playlist) {
        return redirect("/");
    }

    if ( playlist.private ) {
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return redirect("/");
        }
        if ( session.user.id !== playlist.userId ) {
            return redirect("/");
        }
    }

    if (playlist.isArchived) {
        return redirect("/");
    }

    return (
        <div className="min-h-full pb-10 md:pb-0 bg-[#111]">
            <Header
                id={playlist.id}
                color={playlist?.color||"#242424"}
                image={playlist?.image || "/assets/playlist.png"}
                name={playlist.name}
                songs={playlist._count.songs}
                description={playlist?.description||undefined}
                isPrivate={playlist.private}
                userId={playlist.userId}
            />
            <Songs
                id={playlist.id}
                userId={playlist.userId}
            />
        </div>
    )
}

export default PlaylistPage