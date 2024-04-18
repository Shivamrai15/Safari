interface AuthLayoutProps {
    children : React.ReactNode
}

const AuthLayout = ({
    children
} : AuthLayoutProps ) => {
    return (
        <main className="h-full overflow-x-hidden">
            {children}
        </main>
    )
}

export default AuthLayout;