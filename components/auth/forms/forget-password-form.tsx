"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { ForgetPasswordSchema } from "@/schemas/forget-password.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import axios from "axios";

export const ForgetPasswordForm = () => {

    const [ loading, setLoading ] = useState(false);

    const form = useForm<z.infer<typeof ForgetPasswordSchema>>({
        resolver : zodResolver(ForgetPasswordSchema),
        defaultValues : {
            email : ""
        }
    });

    const handleSubmit = async (values : z.infer<typeof ForgetPasswordSchema>) => {
        try {
            
            setLoading(true);
            await axios.post("/api/v1/auth/reset", values);
            toast.success("We sent you an email.");
            form.reset();

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
        <div className="max-w-96 w-full space-y-8">
            <div className="space-y-3 text-base font-medium">
                <h1 className="text-2xl md:text-3xl font-extrabold">Reset your password</h1>
                <p>Can&apos;t remember your login details? Enter your email address. We&apos;ll send you a link to reset your password</p>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-6 md:space-y-10"
                >
                    <div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel className="text-zinc-300" >Your email address</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            {...field}
                                            disabled = {loading}
                                            className="bg-transparent h-12 border-zinc-600 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-zinc-200 transition-all focus:border-zinc-200 focus:border-2"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-14 rounded-full bg-red-600/90 hover:bg-red-600/80 text-white font-semibold text-base"
                        disabled = {loading}
                    >
                        Send link
                    </Button>
                    <Link
                        href="/login"
                        className="text-zinc-400 text-sm font-semibold underline block hover:text-zinc-200 transition"
                    >
                        Back to login
                    </Link>
                </form>
            </Form>
        </div>
    )
}
