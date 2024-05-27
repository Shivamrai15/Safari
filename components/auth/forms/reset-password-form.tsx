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
import { ResetPasswordSchema } from "@/schemas/reset.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

interface ResetPasswordFormProps {
    id : string;
}


export const ResetPasswordForm = ({
    id
} : ResetPasswordFormProps ) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form  = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver : zodResolver(ResetPasswordSchema),
        defaultValues : {
            password : "",
            id
        }
    });

    const handleSubmit = async ( values : z.infer<typeof ResetPasswordSchema> ) => {
        try {
            
            setLoading(true);
            await axios.patch("/api/v1/auth/new-password", values );
            toast.success("Your password has been changed");
            router.replace("/login");

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
        <div className="max-w-80 h-full w-full space-y-8">
            <div className="space-y-3 text-base font-medium">
                <h1 className="text-2xl md:text-3xl font-extrabold select-none">Change your password</h1>
                <p className="select-none">Please enter your new password below!</p>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-6 md:space-y-10"
                >
                    <div>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel className="text-zinc-300 select-none" >Your new password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
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
                        Change Password
                    </Button>
                </form>
            </Form>
        </div>
    )
}
