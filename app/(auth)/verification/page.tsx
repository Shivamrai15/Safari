import { EmailVerificationFrom } from "@/components/auth/forms/email-verification-form"


const EmailVerificationPage = () => {
    return (
        <div className="h-full w-full bg-gradient-to-b from-neutral-900 to-black flex items-center justify-center p-6">
            <EmailVerificationFrom/>
        </div>
    )
}

export default EmailVerificationPage