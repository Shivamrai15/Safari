"use client"

import * as z from "zod";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { RegistrationSchema } from "@/schemas/registration.schema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormWrapper } from "../utils/form-wrapper";


export const RegistrationForm = () => {
    
    const [ loading, setLoading ] = useState(false);

    const form = useForm<z.infer<typeof RegistrationSchema>>({
        resolver : zodResolver(RegistrationSchema),
        defaultValues : {
            email : "",
            name : "",
            password : ""
        }
    });

    const handleSubmit = async ( values : z.infer<typeof RegistrationSchema> ) => {
        try {
            setLoading(true);
            await axios.post("/api/v1/auth/register", values);
            toast.success("Verification email has been sent");
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
        <FormWrapper
            label="Create Your"
            socials
            disabled = {loading}
        >
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    <div className="space-y-3">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel className="text-zinc-300 select-none" >Your Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled = {loading}
                                            className="bg-transparent h-12 border-zinc-600 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-zinc-200 transition-all focus:border-zinc-200 focus:border-2"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
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
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-14 rounded-full bg-red-600/90 hover:bg-red-600/80 text-white font-semibold text-base"
                        disabled = {loading}
                    >
                        Create Account
                    </Button>
                    <div>
                        <Link href="/login" className="text-zinc-200 text-sm select-none" aria-disabled = {loading} >
                            Have an account? Log in now
                        </Link>
                    </div>
                </form>
            </Form>
        </FormWrapper>
    )
}
