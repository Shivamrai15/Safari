import { MoodsList } from "@/components/mood/moods-list";
import BrowseButtons from "@/components/utils/browse-buttons";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Moods",
    description: "Browse music by moods",
}

const MoodsPage = () => {
    return (
        <div className="px-6 md:px-10 pb-20 md:pb-10 pt-10 space-y-10 md:pr-32">
            <BrowseButtons/>
            <MoodsList/>
        </div>
    )
}

export default MoodsPage;
