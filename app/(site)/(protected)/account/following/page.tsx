import { Followings } from "@/components/playlist/followings"
import { PreviousButton } from "@/components/utils/previous-button"


const FollowingPage = () => {
    return (
        <main className="w-full px-6 md:px-14 lg:px-20 pb-20 md:pb-10 pt-10 md:pt-20">
            <div className="md:pr-32 space-y-12">
                <header>
                    <PreviousButton/>
                </header>
                <Followings/>
            </div>
        </main>
    )
}

export default FollowingPage