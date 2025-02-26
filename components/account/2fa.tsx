"use client";

import axios from "axios";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { get2FAStatus } from "@/server/account";
import { Loader } from "@/components/utils/loader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TwoFactorAuthForm } from "@/components/auth/forms/2fa-form";
import { PasswordModal } from "@/components/modals/password-modal";


export const TwoFactorAuthentication = () => {

    const [secretUrl, setSecretUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);
    
    const queryClient = useQueryClient();

    const { data, error, isPending } = useQuery({
        queryKey : ["two-factor-authentication"],
        queryFn : async()=>{
            return await get2FAStatus();
        }
    });


    const enable2FA = async()=>{
        try {
            setLoading(true);
            const response = await axios.post("/api/v1/user/account/2fa/setup", {password});
            const { secret } = response.data;
            setOpen(false);
            setSecretUrl(secret);
        } catch (error) {
            console.log("Enable 2FA error", error);
            toast.error("Failed to enable two factor authentication");
        } finally {
            setLoading(false);
        }
    }


    const disable2FA = async()=>{
        try {
            setLoading(true);
            const response = await axios.patch("/api/v1/user/account/2fa/setup", {password});
            await queryClient.invalidateQueries({
                queryKey : ["two-factor-authentication"]
            });
            setOpen(false);
        } catch (error) {
            console.log("Disable 2FA error", error);
            toast.error("Failed to disable two factor authentication");
        } finally {
            setLoading(false);
        }
    }

    if (isPending) {
        return <Loader/>
    }

    if (!data || error) {
        return null;
    }

    if (data.twoFactorEnabled) {
        return (
            <>
                <div className="w-full">
                    <div className="max-w-md w-full bg-neutral-800/80 p-4 rounded-lg shadow-md space-y-5">
                        <div className="space-y-2">
                            <h2 className="font-semibold select-none">Two factor authentication</h2>
                            <p className="text-sm text-zinc-400 select-none text-pretty">Two-factor authentication is enabled on your account. You'll need a verification code from your authenticator app when logging in.</p>
                        </div>
                        <div className="w-full flex items-center justify-end">
                            <Button
                                size="sm"
                                className="font-bold"
                                disabled={!data.isAuthorized || loading}
                                onClick={()=>setOpen(true)}
                                variant="destructive"
                            >
                                Disable
                            </Button>
                        </div>
                    </div>
                </div>
                <PasswordModal
                    disabled={!data.isAuthorized || loading}
                    password={password}
                    setPassword={setPassword}
                    open={open}
                    setOpen={setOpen}
                    onConfirm={disable2FA}
                />
            </>
        )
    }

    return (
        <>
            {
                secretUrl
                ? (<TwoFactorAuthForm secretUrl={secretUrl} />)
                : (
                    <div className="max-w-md w-full bg-neutral-800/80 p-4 rounded-lg shadow-md space-y-5">
                        <div className="space-y-2">
                            <h2 className="font-semibold select-none">Enable two factor authentication</h2>
                            <p className="text-sm text-zinc-400 select-none text-pretty">Add an extra layer of security to your account with two-factor authentication. You'll need a verification code from your authenticator app when logging in.</p>
                        </div>
                        <div className="w-full flex items-center justify-end">
                            <Button
                                size="sm"
                                className="font-bold"
                                disabled={!data.isAuthorized || loading}
                                onClick={()=>setOpen(true)}
                            >
                                Enable
                            </Button>
                        </div>
                    </div>
                )
            }
            <PasswordModal
                disabled={!data.isAuthorized || loading}
                password={password}
                setPassword={setPassword}
                open={open}
                setOpen={setOpen}
                onConfirm={enable2FA}
            />
        </>
    )
}
