import { Metadata } from "next";


interface ResetPasswordLayoutProps {
    children : React.ReactNode;
}

export const metadata : Metadata = {
    title : "Reset your password"
}

const ResetPasswordLayout = ({
    children
} : ResetPasswordLayoutProps ) => {
    return (
        <section className="h-full">
            {children}
        </section>
    )
}

export default ResetPasswordLayout;