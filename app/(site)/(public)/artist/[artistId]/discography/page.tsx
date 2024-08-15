
import { redirect } from "next/navigation";
import { getArtistName } from "@/server/artist";
import { Lists } from "@/components/discography/list";
import { Header } from "@/components/discography/header";

interface  DiscographyPageProps {
    params : {
        artistId : string
    }
}


const DiscographyPage = async({
    params
} : DiscographyPageProps ) => {

    const artist = await getArtistName(params.artistId);

    if (!artist) {
        redirect("/");
    }

    return (
        <main className="min-h-full relative bg-[#121212] space-y-10 discography-scroll" >
            <Header name={artist.name} />
            <section className="px-4 md:px-20 md:pr-32">
                <Lists artistId = {artist.id} />
            </section>
        </main>
    )
}

export default DiscographyPage