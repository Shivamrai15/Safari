"use client"

import * as z from "zod";
import { useForm } from "react-hook-form";
import { AccountSchema } from "@/schemas/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccountResponse } from "@/types";
import { KeyedMutator } from "swr";
import { useAccount } from "@/hooks/use-account";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

export const SettingsForm = () => {
    
    const { data , isLoading, mutate } : { 
        data : AccountResponse,
        isLoading: boolean,
        mutate : KeyedMutator<any>
    } = useAccount();

    const form = useForm<z.infer<typeof AccountSchema>>({
        resolver: zodResolver(AccountSchema),
        defaultValues: {
            showRecommendations: isLoading ? true :  data.showRecommendations,
            privateSession: isLoading ? false : data.privateSession,
        },
    });

    const { data : accountData } : { data : AccountResponse|undefined } = useAccount();    

    const { isSubmitting } = form.formState;

    useEffect(()=>{
        if ( !isLoading && data ) {
            form.reset(data);
        }
    }, [isLoading, data]);

    const onSubmit = async(values: z.infer<typeof AccountSchema>) => {
        try {
            await axios.patch("/api/v1/user/account", values);
            mutate();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong. Please try again later.");
        }
    };
    
    
    return (
        <Form {...form}>
            <form
                className="w-full space-y-10"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <h1 className="text-2xl md:text-3xl font-extrabold select-none">Personlized Settings</h1>
                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="privateSession"
                        render={({ field })=>(
                            <FormItem className="flex items-center gap-x-2 justify-between">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-white font-semibold text-base select-none">
                                        Private Session
                                    </FormLabel>
                                    <FormDescription className="select-none"> 
                                        Turn on Private Session to listen without sharing your activity.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isSubmitting||isLoading|| !accountData?.isActive}
                                        type="submit"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="showRecommendations"
                        render={({ field })=>(
                            <FormItem className="flex items-center gap-x-2 justify-between">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-white font-semibold text-base select-none">
                                        Recommend Songs
                                    </FormLabel>
                                    <FormDescription className="select-none">
                                        Allow Safari to recommend songs based on your activity.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isSubmitting||isLoading|| !accountData?.isActive}
                                        type="submit"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    )
}
