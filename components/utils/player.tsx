"use client";

import {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import {
    Maximize2,
    Repeat,
    Repeat1,
    ShuffleIcon,
    Volume1,
    Volume2,
    VolumeX
} from "lucide-react";

import { Slider } from "@/components/ui/slider";
import { useControls } from "@/hooks/use-controls";
import { usePlayer } from "@/hooks/use-player";
import { useQueue } from "@/hooks/use-queue";
import { songLength } from "@/lib/utils";
import { FaPlay, FaPause } from "react-icons/fa";
import { FaForwardStep, FaBackwardStep } from "react-icons/fa6";
import { PlayerSongInfo } from "./player-song-info";
import { Range } from "@/components/ui/range";
import { SongSheet } from "./song-sheet";
import { useSheet } from "@/hooks/use-sheet";
import { LikeButton } from "./like-button";
import axios from "axios";
import { useAccount } from "@/hooks/use-account";
import { PlayerShortCutProvider } from "@/providers/player-shortcut-provider";

export const Player = () => {

    const { onOpen } = useSheet();
    const { current, deQueue, pop, shuffle } = useQueue();
    const { repeat, setRepeat, mute, setMute, volume, setVolume } = useControls();
    const { setAlbumId, setSongId , setIsPlaying } = usePlayer();
    const [ play, setPlay ] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement|null>(null);

    const { data , isLoading, } : { 
        data : { 
            name: string | null,
            id: string,
            privateSession: boolean
        },
        isLoading: boolean,
    } = useAccount();

    
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
            } else {
                audioRef.current.play();
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
            await axios.post("/api/v1/user/history", { songId : current.id });
        }
    }

    useEffect(() => {
        if (current) {
            setAlbumId( current.albumId );
            setSongId( current.id );
            if ( !isLoading && !data.privateSession ) {
                updateHistory();
            }
        }
    }, [current]);

    useEffect(()=>{
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume, current])

    const seekTime = ( num : number ) => {
        if (audioRef.current) {
            audioRef.current.currentTime = num;
            setCurrentTime(num);
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

    return (
        <>
            <div className="w-full h-full bg-neutral-900 hidden md:block relative">
                <div className="w-full absolute -top-5 py-2">
                    <Slider 
                        className="cursor-pointer h-5"
                        value={[currentTime]}
                        step={1}
                        max={current?.duration||1}
                        onValueChange={(e)=>seekTime(e[0])}
                    />
                </div>
                <div className="w-full h-full flex items-center justify-center px-6 lg:px-10">
                    <div className="grid grid-cols-3 w-full">
                        <div className="w-full h-11">
                            <PlayerSongInfo song={current} />
                        </div>
                        <div className="w-full flex items-center justify-center gap-x-5 lg:gap-x-6">
                            <span className="w-8 text-sm text-zinc-300">{songLength(Math.floor(currentTime))}</span>
                            <FaBackwardStep
                                className="h-5 w-5 text-zinc-300 hover:text-white cursor-pointer"
                                onClick={pop}
                            />
                            <Icon
                                className="h-8 w-8 cursor-pointer"
                                onClick={togglePlay}
                            />
                            <FaForwardStep
                                className="h-5 w-5 text-zinc-300 hover:text-white cursor-pointer"
                                onClick={deQueue}
                            />
                            <span className="text-sm text-zinc-300" >{ songLength(current?.duration || 0)}</span>
                        </div>
                        <div className="w-full flex items-center justify-end gap-x-3 lg:gap-x-6">
                            <LikeButton id = { current?.id } className="h-6 w-6"/>
                            <ShuffleIcon onClick={shuffle} />
                            <RepeatIcon onClick={toggleRepeat}  className="h-6 w-6 text-white cursor-pointer" />
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
                    style={{background : `${current?.album.color}`}}
                >
                    <Slider
                        value={[currentTime]}
                        step={1}
                        max={current?.duration||1}
                    />
                    <div className="flex items-center h-full px-4">
                        <div className="w-[calc(100%-3.5rem)] h-8">
                            <PlayerSongInfo song={current} />
                        </div>
                        <div className="w-14 h-10 flex items-center justify-center">
                            <Icon
                                className="h-7 w-7 cursor-default"
                                onClick={(e)=>{
                                    e.stopPropagation();
                                    togglePlay();
                                }}
                            />
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
                    onEnded={()=>{
                        deQueue();
                    }}
                    onLoadedMetadata={()=>handleUpdateMetadata()}
                    onTimeUpdate={handleTimeUpdate}
                    loop = {repeat}
                    muted = {mute}
                    title={current?.name}
                    className="h-0 w-0 sr-only"
                    autoPlay src={current?.url}
                    >   
            </audio>
            <SongSheet
                currentTime={currentTime}
                seekTime={seekTime}
                togglePlay={togglePlay}
                Icon={Icon}
                RepeatIcon={RepeatIcon}
                toggleRepeat={toggleRepeat}
            />
            <PlayerShortCutProvider onClick = {togglePlay} />
        </>
    )
}
