import { ForgetPasswordForm } from "@/components/auth/forms/forget-password-form"
import { Metadata } from "next";

export const metadata : Metadata = {
    title : "Reset your password",
}

const ForgetPasswordPage = () => {
    return (
        <div className="bg-neutral-900 h-full flex justify-center p-6 py-10 md:py-20">
            <ForgetPasswordForm/>
        </div>
    )
}

export default ForgetPasswordPage