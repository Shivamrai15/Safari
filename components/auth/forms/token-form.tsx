"use client";

import { Button } from "@/components/ui/button";
import { 
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form";
import { 
    InputOTP,
    InputOTPGroup,
    InputOTPSlot
} from "@/components/ui/input-otp";
import { LoginSchema } from "@/schemas/login.schema";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

interface TokenFormProps {
    form : UseFormReturn<{
        email: string;
        password: string;
        token?: string | undefined;
    }, any, undefined>;
    open: boolean;
    disabled: boolean;
    handleLogin : (values : z.infer<typeof LoginSchema>) => void;
}

export const TokenForm = ({
    form,
    open,
    disabled,
    handleLogin
}: TokenFormProps ) => {
    
    return (
        <Dialog open={open}>
            <DialogContent className="max-w-80 w-full bg-neutral-900 border p-4 space-y-4" >
                <FormField
                    control={form.control}
                    name="token"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="select-none">2FA Code</FormLabel>
                            <FormControl>
                                <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS} disabled={disabled} >
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
                            <FormDescription className="select-none">
                                Please enter the one-time password sent from your authenticator app.
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    type="submit"
                    disabled={disabled}
                    onClick={()=>form.handleSubmit(handleLogin)()}
                >
                    Continue
                </Button>
            </DialogContent>
        </Dialog>
    )
}
