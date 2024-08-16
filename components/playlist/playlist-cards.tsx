"use client";

import { useSession } from "next-auth/react";
import { Card } from "./card";

const PlaylistCards = () => {

    const session = useSession();

    if ( session.status === "unauthenticated" ) {
        return null;
    }

    return (
        <div className="w-full flex gap-6 md:gap-10 flex-wrap items-center justify-start">
            <Card href="/liked-music" image="/assets/liked-thumb.png" label="Liked Songs" />
            <Card href="/history" image="/assets/history.avif" label="History" />
        </div>
    );
}

export default PlaylistCards;