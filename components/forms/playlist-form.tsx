"use client";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Globe, GlobeLock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaylistSchema } from "@/schemas/playlist.schema";
import { usePlaylistModal } from "@/hooks/use-playlist-modal";
import { usePlaylist } from "@/hooks/use-playlist";

export const PlaylistForm = () => {


    const { loading, setLoading, onClose, data, setData } = usePlaylistModal();
    const { mutate } = usePlaylist();

    const form = useForm<z.infer<typeof PlaylistSchema>>({
        resolver : zodResolver(PlaylistSchema),
        defaultValues : {
            name : data?.name || "",
            private : (data ? data.private : true),
            description : data?.description
        }
    });

    const onSubmit = async( values : z.infer<typeof PlaylistSchema> )=>{
        try {
            setLoading(true);
            if ( !data ) {
                await axios.post("/api/v1/user/playlist", values);
            } else {
                await axios.patch(`/api/v1/user/playlist/${data.id}`, values);
                setData(undefined);
            }
            onClose();
            mutate();
        } catch (error) {
            if ( axios.isAxiosError(error) ){
                toast.error(`${error.response?.data}`);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full space-y-4 mt-4">
            <h2 className="text-lg font-semibold select-none">
                { data ? "Edit Playlist" : "Create Playlist" }
            </h2>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field})=>(
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Add a name"
                                            className="h-11 w-full bg-neutral-700 border-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all focus:border-zinc-600 focus:border-2 drop-shadow-[0_0_50px_rgba(0,0,0,0.25)]"
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage className="bg-red-600 text-white px-3 py-1.5 rounded-sm border-b-2 border-white" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field})=>(
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Add an optional description"
                                            disabled={loading}
                                            className="h-32 resize-none w-full bg-neutral-700 border-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all focus:border-zinc-600 focus:border-2 drop-shadow-[0_0_50px_rgba(0,0,0,0.25)]"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="private"
                            render={({field})=>(
                                <FormItem>
                                    <Select onValueChange={(e:string)=>{field.onChange(e==="true")}} defaultValue={`${field.value}`}>
                                        <FormControl>
                                            <SelectTrigger className = "py-2 h-auto bg-neutral-900 drop-shadow-[0_0_50px_rgba(0,0,0,0.25)]" disabled={loading} >
                                                <SelectValue  placeholder="Select playlist type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className = "bg-neutral-900" >
                                            <SelectItem value="true">
                                                <div className="w-full flex items-center gap-x-3">
                                                    <GlobeLock className="h-6 w-6" />
                                                    <div className="text-left">
                                                        <p>Private</p>
                                                        <span className="text-xs text-zinc-400" >Only you can see</span>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="false">
                                                <div className="w-full flex items-center gap-x-3">
                                                    <Globe className="h-6 w-6"/>
                                                    <div className="text-left space-y-0">
                                                        <p>Public</p>
                                                        <span className="text-xs text-zinc-400" >Anyone can search and view</span>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-full flex items-end justify-end space-x-4">
                        <Button
                            variant="ghost"
                            className="font-bold text-zinc-300"
                            type="button"
                            disabled={loading}
                            onClick={()=>onClose()}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="font-bold px-8 h-12 rounded-full"
                            type="submit"
                            disabled={loading}
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

