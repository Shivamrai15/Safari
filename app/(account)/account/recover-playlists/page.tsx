import { RecoverPlaylist } from "@/components/account/recover-playlists"
import { PreviousButton } from "@/components/utils/previous-button"
import { Metadata } from "next"

export const metadata : Metadata = {
    title : "Recover playlists - Safari"
}

const RecoverPlaylistPage = () => {
    return (
        <main className="min-h-full w-full py-20 flex justify-center">
            <div className="w-full space-y-10">
                <div className="space-y-16 md:space-y-20">
                    <h2 className="text-3xl md:text-5xl font-extrabold select-none" >Recover playlists</h2>
                </div>
                <RecoverPlaylist/>
            </div>
        </main>
    )
}

export default RecoverPlaylistPage