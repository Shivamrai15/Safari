import { RegistrationForm } from "@/components/auth/forms/registration-form"
import { Metadata } from "next"

export const metadata : Metadata = {
    title : "Registration | Safari"
}

const SignUpPage = () => {
    return (
        <div className="min-h-full bg-neutral-900 flex items-center justify-center">
            <RegistrationForm/>
        </div>
    )
}

export default SignUpPage