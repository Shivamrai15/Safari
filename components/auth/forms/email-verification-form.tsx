"use client";

import { Button } from "@/components/ui/button";
import { SyncLoader } from "react-spinners";
import { FormError } from "@/components/auth/utils/form-error";
import { FormSuccess } from "@/components/auth/utils/form-success";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tokenVerification } from "@/server/email-verification-token";

export const EmailVerificationFrom = () => {
    
    const [ error, setError ] = useState<string|undefined>();
    const [ success, setSuccess ] = useState<string|undefined>();
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const verifyToken = useCallback(()=>{
        if ( success || error) return ;

        if (!token) {
            setError("Invalid verification link");
            return ;
        }

        tokenVerification(token).then((response)=>{
            if(response.error) {
                setError(response.error);
            }
            if (response.success) {
                setSuccess(response.success);
            }
        }).catch((error)=>{
            console.error(error);
            setError("Internal server error");
        });

    }, [token, error, success]);

    useEffect(()=>{
        verifyToken();
    }, [verifyToken]);
    
    return (
        <div className="max-w-sm w-full p-4 bg-neutral-800/70 rounded-md py-6">
            <div className="w-full flex items-center justify-center">
                {
                    !error && !success && (
                        <div className="flex items-center justify-center py-10 ">
                            <SyncLoader color="#393939" />
                        </div>
                    )
                }
                {
                    error && (
                        <FormError message={error} />
                    )
                }
                {
                    success && (
                        <FormSuccess message={success} />
                    )
                }
            </div>
            <Button
                onClick={()=>router.push("/login")}
                disabled = { !error && !success  }
                className="w-full mt-6 rounded-full bg-red-600/90 hover:bg-red-600/80 h-12 text-white font-semibold"
            >
                Back to Login
            </Button>
        </div>
    )
}
