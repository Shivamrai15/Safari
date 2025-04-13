import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getUserSubscription } from "@/server/queries";
import { SubscriptionDetails } from "@/components/account/subscription-details";
import { AccountInfo } from "@/components/account/account-info";
import { Playlists } from "@/components/account/playlists";
import { SettingsForm } from "@/components/forms/settings-form";


const ProfilePage = async() => {

    const session = await auth();
    if ( !session || !session.user || !session.user.id ) {
        redirect("/");
    }

    const subscription = await getUserSubscription();

    return (
        <main className="w-full pt-20 pb-20 md:pb-10 min-h-full space-y-10 md:space-y-20 scroll-smooth">
            <div className="w-full h-full flex justify-center items-center">
                <div className="w-full space-y-20">
                    <header className="w-full flex items-center gap-x-6 md:gap-x-10">
                        <div className="h-28 shrink-0 w-28 md:h-40 md:w-40 rounded-full overflow-hidden relative">
                            <Image
                                src={session.user?.image || "/assets/user.png" }
                                alt="Profile Image"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="w-full space-y-2">
                            <span className="block text-zinc-400  font-semibold select-none">
                                Profile
                            </span>
                            <h3 className="text-white text-3xl sm:text-4xl md:text-6xl font-extrabold line-clamp-1 select-none">
                                {session.user?.name || "User"}
                            </h3>
                            <AccountInfo/>
                        </div>
                    </header>
                    <div className="w-full">
                        <SubscriptionDetails subscription={subscription} />
                    </div>
                    <SettingsForm/>
                    <Playlists/>
                </div>
            </div>
        </main>
    )
}

export default ProfilePage;