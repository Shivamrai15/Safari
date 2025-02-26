"use client";

import * as z from "zod";
import axios from "axios";

import QRCode from "react-qr-code";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot
} from "@/components/ui/input-otp";
import { ScanLine } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TwoFactorAuthSchema } from "@/schemas/two-factor.schema";


interface TwoFactorAuthFormProps {
    secretUrl: string;
}

export const TwoFactorAuthForm = ({
    secretUrl
}: TwoFactorAuthFormProps) => {    
    
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof TwoFactorAuthSchema>>({
        resolver : zodResolver(TwoFactorAuthSchema),
    });

    const { isSubmitting, isValid } = form.formState;


    const onSubmit = async(values : z.infer<typeof TwoFactorAuthSchema>)=>{
        try {
            await axios.patch("/api/v1/user/account/2fa/verify", values);
            await queryClient.invalidateQueries({
                queryKey : ["two-factor-authentication"]
            });
            toast.success("OTP verified successfully");
        } catch (error) {
            console.log("Verify OTP error", error);
            toast.error("Failed to verify OTP. Please try again.");
        }
    }


    return (
        <div className="w-full space-y-12">
            <p className="text-zinc-300 text-sm select-none">Using an authenticator app like Google Authenticator, Microsoft Authenticator, Authy or iPassword, scan this QR code. It will generate a 6 digit code for you to enter in next step.</p>
            <div className="flex flex-col items-center justify-center w-full gap-y-4">
                <div className="size-10 flex items-center justify-center border border-neutral-800 rounded-lg bg-neutral-800/60">
                    <ScanLine/>
                </div>
                <h1 className="text-xl md:text-2xl font-semibold select-none">Scan QR Code</h1>
            </div>
            <div className="w-full space-y-6">
                <div className="flex items-center justify-center w-full">
                    <div className="size-44 md:size-48 p-2 bg-neutral-800/80 rounded-md border">
                        <QRCode 
                            value={secretUrl}
                            className="size-full"
                            bgColor="#00000000"
                            fgColor="#FFFFFF"
                        />
                    </div>
                </div>
            </div>
            <Form {...form}>
                <form
                    className="flex items-center justify-center"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="w-fit space-y-4">
                        <FormField
                            control={form.control}
                            name="token"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="select-none">Enter 6 digit code</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS} disabled={isSubmitting} >
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button
                            className="w-full font-semibold"
                            size="sm"
                            variant="secondary"
                            disabled={!isValid || isSubmitting}
                        >
                            Verify
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
