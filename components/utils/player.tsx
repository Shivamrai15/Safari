"use client";

import {
    useRef,
    useMemo,
    useState,
    useEffect,
    MutableRefObject,
} from "react";
import Hls from "hls.js";
import axios from "axios";


import {
    Loader2,
    Maximize2,
    Repeat,
    Repeat1,
    ShuffleIcon,
    Volume1,
    Volume2,
    VolumeX
} from "lucide-react";

import { useAds } from "@/hooks/use-ads";
import { usePlay } from "@/hooks/use-play";
import { useSheet } from "@/hooks/use-sheet";
import { useQueue } from "@/hooks/use-queue";
import { usePlayer } from "@/hooks/use-player";
import { useSocket } from "@/hooks/use-socket";
import { useAccount } from "@/hooks/use-account";
import { useControls } from "@/hooks/use-controls";
import { useShuffleList } from "@/hooks/use-shuffle-list";
import { useSocketEvents } from "@/hooks/use-socket-events";
import { useAiShuffleWorker } from "@/hooks/use-ai-shuffle-worker";

import { Slider } from "@/components/ui/slider";
import { cn, songLength } from "@/lib/utils";
import { FaPlay, FaPause } from "react-icons/fa";
import { FaForwardStep, FaBackwardStep } from "react-icons/fa6";
import { PlayerSongInfo } from "./player-song-info";
import { Range } from "@/components/ui/range";
import { SongSheet } from "./song-sheet";
import { LikeButton } from "./like-button";
import { PlayerShortCutProvider } from "@/providers/player-shortcut-provider";
import { AdInfo } from "./ad-info";
import { DEQUEUE, PAUSE, PLAY, POP, SEEK } from "@/lib/events";
import { Ad, Album, Song } from "@prisma/client";
import { getRandomAd } from "@/server/ad";
import { AiShuffleButton } from "./ai-shuffle-button";

export const Player = () => {

    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement|null>(null);
    const [ metadataLoading, setMetadataLoading ] = useState(true);
    const [isAdPlaying, setIsAdPlaying] = useState(false);
    const [ad, setAd] = useState<Ad|null>(null);

    const { onOpen } = useSheet();
    const { play, setPlay } = usePlay();
    const { visited, setVisited } = useShuffleList();
    const { setAlbumId, setSongId , setIsPlaying } = usePlayer();
    const { prevAdTimeStamp, setPrevAdTimeStamp } = useAds();
    const { current, deQueue, pop, shuffle, queue, enQueue } = useQueue();
    const { repeat, setRepeat, mute, setMute, volume, setVolume, aiShuffle } = useControls();
    

    const socket = useSocket();
    const { connected, roomId } = useSocketEvents();


    const { data , isLoading } : { 
        data : { 
            name: string | null,
            id: string,
            privateSession: boolean,
            isActive : boolean
        },
        isLoading: boolean,
    } = useAccount();

    useAiShuffleWorker({
        currentId: current?.id || '',
        visited: visited,
        aiShuffle: aiShuffle,
        queue: queue,
        enQueue: enQueue,
        setVisited: setVisited
    });

    
    const Icon = play ? FaPause : FaPlay;
    const RepeatIcon = repeat ? Repeat1 : Repeat;


    const VolumeIcon = useMemo(()=>{
        if (mute) {
            return VolumeX;
        }
        if(volume === 0 ) {
            return VolumeX;
        }
        if(volume <= 0.5) {
            return Volume1;
        }
        return Volume2;
    }, [volume, mute]);

    const togglePlay = () => {
        if ( audioRef.current ) {
            if ( play ) {
                audioRef.current.pause();
                if ( connected ) {
                    socket.emit(PAUSE, {roomId});
                }
            } else {
                audioRef.current.play();
                if ( connected ) {
                    socket.emit(PLAY, {roomId});
                }
            }
        }
    }

    const toggleRepeat = () => {
        if(repeat){
            setRepeat(false);
        } else {
            setRepeat(true);
        }
    }

    const toggleMute = () => {
        if (mute) {
            setMute(false);
        } else {
            setMute(true);
        }
    }

    const handleTimeUpdate = () => {
        if ( audioRef.current ) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const updateHistory = async() => {
        if (current) {
            try {
                await axios.post("/api/v1/user/history", { songId : current.id });
                await axios.post("/api/v1/views", { songId : current.id });
            } catch (error) {
                console.log(error);
            }
        }
    }


    const hlsPlayer = ( song : Song & { album: Album }, audio: MutableRefObject<HTMLAudioElement|null>)=> {
        if (!audio.current){
            return ;
        }

        setMetadataLoading(true);
        setAlbumId( song.albumId );
        setSongId( song.id );
                        
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(song.url);
            hls.attachMedia(audio.current);
            hls.on(Hls.Events.MANIFEST_PARSED, ()=>{
                audio.current?.play();
            });
        } else if (audio.current.canPlayType('application/vnd.apple.mpegurl')) {
            audio.current.src = song.url;
            audio.current.addEventListener('loadedmetadata', () => {
                audio.current?.play();
            });
        }
    }

    useEffect(() => {

        const updateData = async() => {
            try {
                if ( data?.isActive ) {
                    if (current && audioRef.current) {
                        hlsPlayer(current, audioRef);
                        if ( !isLoading && !data.privateSession ) {
                            updateHistory();
                        }
                    }
                    return;
                }
    
                if ( isAdPlaying ) {
                    return;
                }
    
                if ( prevAdTimeStamp && ( (Date.now() - prevAdTimeStamp)/60000 < 30 ) ) {
                    if (current && audioRef.current) {
                        hlsPlayer(current, audioRef);
                        if ( !isLoading && !data.privateSession ) {
                            updateHistory();
                        }
                    }
                    return;
                }
    
                if ( audioRef.current ) {
                    setIsAdPlaying(true);
                    const randomAd = await getRandomAd();
                    if (Hls.isSupported() && randomAd) {
                        const hls = new Hls();
                        hls.loadSource(randomAd.url);
                        hls.attachMedia(audioRef.current);
                        hls.on(Hls.Events.MANIFEST_PARSED, ()=>{
                            audioRef.current?.play();
                        });
                    } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                        audioRef.current.src = randomAd?.url||"";
                        audioRef.current.addEventListener('loadedmetadata', () => {
                            audioRef.current?.play();
                        });
                    }
                    setAd(randomAd);
                    setPrevAdTimeStamp();
                    setSongId("");
                }
            } catch (error) {
                console.log("Update error", error);   
            }

        }
        updateData();
    }, [current, isAdPlaying]);


    useEffect(()=>{
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume, current]);


    const seekTime = ( num : number ) => {
        if (audioRef.current) {
            audioRef.current.currentTime = num;
            setCurrentTime(num);
            if ( connected ){
                socket.emit(SEEK, { roomId, time:num });
            }
        }
    }

    const handleUpdateMetadata = ()=>{
        if ( 'mediaSession' in navigator ){
            navigator.mediaSession.metadata = new MediaMetadata({
                title : current?.name || "",
                album : current?.album.name || "",
                artwork: [
                    { src: `${current?.image}`, sizes: '96x96', type: 'image/avif' },
                    { src: `${current?.image}`, sizes: '96x96', type: 'image/webp' },
                    { src: current?.image||"", sizes: '96x96', type: 'image/jpeg' },
                ],
            });
            
        }
    }

    useEffect(()=>{

        const handleSeekEvent = (payload: { roomId: string, time: number }) => {
            if (audioRef.current) {
                audioRef.current.currentTime = payload.time;
                setCurrentTime(payload.time);
            }
        }

        const handlePlayEvent = () => {
            if ( audioRef.current ) {
                audioRef.current.play();
            }
        }

        const handlePauseEvent = () => {
            if ( audioRef.current ) {
                audioRef.current.pause();
            }
        }

        socket.on(PAUSE, handlePauseEvent);
        socket.on(PLAY, handlePlayEvent);
        socket.on(SEEK, handleSeekEvent);

        return () => {
            socket.off(PAUSE, handlePauseEvent);
            socket.off(PLAY, handlePlayEvent);
            socket.off(SEEK, handleSeekEvent);
        }

    }, []);


    const handleOnEnd = () => {
        if ( isAdPlaying ) {
            setIsAdPlaying(false);
            return;
        }
        deQueue();
        if ( connected ) {
            socket.emit(DEQUEUE, {roomId});
        }
    }

    return (
        <>
            <div className="w-full h-full bg-neutral-900 hidden md:block relative">
                <div className="w-full absolute -top-5 py-2">
                    <Slider 
                        className={cn(
                            "cursor-pointer h-5",
                            data?.isActive === false && "md:cursor-not-allowed" 
                        )}
                        value={[currentTime]}
                        step={1}
                        max={isAdPlaying ? (ad?.duration||1) : (current?.duration||1)}
                        onValueChange={(e)=>seekTime(e[0])}
                        disabled = {data?.isActive === false}
                    />
                </div>
                <div className="w-full h-full flex items-center justify-center px-6 lg:px-10">
                    <div className="grid grid-cols-3 w-full">
                        <div className="w-full h-11">
                            {
                                isAdPlaying ? (
                                    <AdInfo ad={ad} />
                                ) : (
                                    <PlayerSongInfo song={current} />  
                                )
                            }
                        </div>
                        <div className="w-full flex items-center justify-center gap-x-5 lg:gap-x-6">
                            <span className="w-8 text-sm text-zinc-300">{songLength(Math.floor(currentTime))}</span>
                            <button
                                onClick={()=>{
                                    pop();
                                    if ( connected ) {
                                        socket.emit(POP, {roomId});
                                    }
                                }}
                                disabled = {data?.isActive === false}
                                className="focus:outline-none"
                            >
                                <FaBackwardStep
                                    className={cn(
                                        "h-5 w-5 text-zinc-300 hover:text-white cursor-pointer",
                                        data?.isActive === false && "text-zinc-400 hover:text-zinc-400 cursor-not-allowed"
                                    )}
                                />
                            </button>
                            {
                                metadataLoading ? (
                                    <Loader2 className="h-8 w-8 text-zinc-300 animate-spin"/>
                                ) : (
                                    <Icon
                                        className="h-8 w-8 cursor-pointer"
                                        onClick={togglePlay}
                                    />
                                )
                            }
                            <button
                                onClick={handleOnEnd}
                                disabled = {isAdPlaying}
                                className="focus:outline-none"
                            >
                                <FaForwardStep
                                    className="h-5 w-5 text-zinc-300 hover:text-white cursor-pointer"
                                />
                            </button>
                            <span className="text-sm text-zinc-300" >{ songLength(isAdPlaying ? (ad?.duration||1) : (current?.duration||1))}</span>
                        </div>
                        <div className="w-full flex items-center justify-end gap-x-3 lg:gap-x-6">
                            <LikeButton id = { current?.id } className="h-6 w-6" disabled = {isAdPlaying} />
                            <button
                                disabled={connected}
                                onClick={shuffle}
                                className={cn(
                                    "focus:outline-none outline-none cursor-pointer",
                                    connected && "cursor-not-allowed"
                                )}
                            >
                                <ShuffleIcon />
                            </button>
                            <AiShuffleButton className="max-lg:hidden shrink-0"/>
                            <button
                                onClick={toggleRepeat}
                                disabled={connected}
                                className={cn(
                                    "focus:outline-none outline-none cursor-pointer",
                                    connected && "cursor-not-allowed"
                                )}
                            >
                                <RepeatIcon className="h-6 w-6 text-white" />
                            </button>
                            <div className="flex items-center gap-2">
                                <VolumeIcon
                                    className="h-5 w-5"
                                    onClick={toggleMute}
                                />
                                <Range
                                    className="w-24 text-white h-3"
                                    step={0.1}
                                    max={1}
                                    value={[volume]}
                                    onValueChange={(e) => setVolume(e[0])}
                                />
                            </div>
                            <Maximize2 className="h-5 w-5 text-white cursor-pointer" onClick={()=>onOpen()} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="md:hidden w-full h-full px-1">
                <div
                    onClick={()=>onOpen()}
                    className="w-full h-full bg-neutral-900 rounded-lg overflow-hidden relative"
                    style={{background : isAdPlaying? `${ad?.image}` :`${current?.album.color}`}}
                >
                    <Slider
                        value={[currentTime]}
                        step={1}
                        max={isAdPlaying ? (ad?.duration||1) : (current?.duration||1)}
                    />
                    <div className="flex items-center h-full px-4">
                        <div className="w-[calc(100%-3.5rem)] h-8">
                            {
                                isAdPlaying ? (
                                    <AdInfo ad={ad} />
                                ) : (
                                    <PlayerSongInfo song={current} />
                                )
                            }
                        </div>
                        <div className="w-14 h-10 flex items-center justify-center">
                            {
                                metadataLoading ? (
                                    <Loader2 className="h-8 w-8 text-zinc-300 animate-spin"/>
                                ) : (
                                    <Icon
                                        className="h-7 w-7 cursor-default"
                                        onClick={(e)=>{
                                            e.stopPropagation();
                                            togglePlay();
                                        }}
                                    />
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <audio
                    ref = {audioRef}
                    onPlay={()=>{
                        setPlay(true);
                        setIsPlaying(true);
                    }}
                    onPause={()=>{
                        setPlay(false);
                        setIsPlaying(false);
                    }}
                    onEnded={handleOnEnd}
                    onLoadedMetadata={()=>handleUpdateMetadata()}
                    onTimeUpdate={handleTimeUpdate}
                    loop = {repeat}
                    muted = {mute}
                    title={current?.name}
                    className="h-0 w-0 sr-only"
                    autoPlay
                    onWaiting={()=>setMetadataLoading(true)}
                    onPlaying={()=>setMetadataLoading(false)}
            >   
            </audio>
            <SongSheet
                currentTime={currentTime}
                seekTime={seekTime}
                togglePlay={togglePlay}
                Icon={Icon}
                RepeatIcon={RepeatIcon}
                toggleRepeat={toggleRepeat}
                active = { data?.isActive }
                play = { play }
                handleOnEnd = { handleOnEnd }
                isAdPlaying = { isAdPlaying }
                ad = {ad}
            />
            <PlayerShortCutProvider
                onClick = {togglePlay}
                audioRef={audioRef}
                play={play}
            />
        </>
    )
}
