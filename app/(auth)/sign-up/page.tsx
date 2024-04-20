import { RegistrationForm } from "@/components/auth/forms/registration-form"
import { Metadata } from "next"

export const metadata : Metadata = {
    title : "Registration | Safari"
}

const SignUpPage = () => {
    return (
        <div className="h-full bg-gradient-to-b from-neutral-900 to-black flex items-center justify-center">
            <RegistrationForm/>
        </div>
    )
}

export default SignUpPage