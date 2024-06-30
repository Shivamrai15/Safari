"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormItem,
    FormField,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { LoginSchema } from "@/schemas/login.schema";
import { FormWrapper } from "@/components/auth/utils/form-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { login } from "@/server/login";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const LoginForm = () => {

    const [ loading, setLoading ] = useState(false);
    const router = useRouter();
    
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver : zodResolver(LoginSchema),
        defaultValues : {
            email : "",
            password : ""
        }
    });

    const handleLogin = async (values : z.infer<typeof LoginSchema>) => {
        try {
            
            setLoading(true);
            const response = await login(values);
            console.log("Step 1")
            if (response.error) {
                toast.error(response.error);
            }
            if (response.info) {
                toast.info(response.info);
            }
        } catch (error) {
            location.reload();
        } finally {
            setLoading(false);
        }
    }

    return (
        <FormWrapper label="Login to your" socials disabled = {loading} >
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(handleLogin)}
                >
                    <div className="space-y-3">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel className="text-zinc-300 select-none" >Your Email</FormLabel>
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
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel className="text-zinc-300 select-none" >Your Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            {...field}
                                            disabled = {loading}
                                            className="bg-transparent h-12 border-zinc-600 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-zinc-200 transition-all focus:border-zinc-200 focus:border-2"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                    <Link
                                        href="/forget-password"
                                        className="text-sm pt-1 block text-zinc-400 hover:text-red-500 select-none"
                                    >
                                        Forget your password?
                                    </Link>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-14 rounded-full bg-red-600/90 hover:bg-red-600/80 text-white font-semibold text-base"
                        disabled = {loading}
                    >
                        Log In
                    </Button>
                    <div>
                        <Link href="/sign-up" className="text-zinc-200 text-sm select-none" aria-disabled = {loading} >
                            Don&apos;t have an account? Sign Up
                        </Link>
                    </div>
                </form>
            </Form>
        </FormWrapper>
    )
}
