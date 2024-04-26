"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { SyncLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/auth/utils/form-error";
import { passwordTokenVerification } from "@/server/password-token-verification";
import { ResetPasswordForm } from "@/components/auth/forms/reset-password-form";

const ResetPasswordPage = () => {
    
    const router = useRouter()

    const [ tokenId, setTokenId ] = useState("");
    const [ error, setError ] = useState("");
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const verifyToken = useCallback(()=>{
        if ( tokenId || error) return ;

        if (!token) {
            setError("Invalid verification link");
            return ;
        }
        passwordTokenVerification(token).then((response)=>{
            if(response.error) {
                setError(response.error);
            }
            if (response.id) {
                setTokenId(response.id);
            }
        }).catch((error)=>{
            console.error(error);
            setError("Internal server error");
        });
    }, [ tokenId, error, token ]);


    useEffect(()=>{
        verifyToken();
    }, [verifyToken]);
    

    return (
        <div className="h-full bg-neutral-900 w-full flex items-center justify-center px-6 py-10 md:py-20 ">
            {
                (!tokenId && !error) && (
                    <SyncLoader color="#303030" />
                    
                )
            }
            {
                error && (
                    <div className="max-w-80 w-full space-y-8">
                        <FormError message={error} />
                        <Button
                            onClick={()=>router.push("/login")}
                            className="w-full h-14 rounded-full bg-red-600/90 hover:bg-red-600/80 text-white font-semibold text-base"
                        >
                            Back to login
                        </Button>
                    </div>
                )
            }
            {
                tokenId && (
                    <ResetPasswordForm id = { tokenId } />
                )
            }
        </div>
    )
}

export default ResetPasswordPage;