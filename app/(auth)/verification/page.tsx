import { EmailVerificationFrom } from "@/components/auth/forms/email-verification-form"


const EmailVerificationPage = () => {
    return (
        <div className="h-full w-full bg-neutral-900 flex items-center justify-center p-6">
            <EmailVerificationFrom/>
        </div>
    )
}

export default EmailVerificationPage