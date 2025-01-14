import Image from "next/image";
import Link from "next/link";

interface LayoutProps {
   children : React.ReactNode; 
}

const Layout = ({ children } : LayoutProps) => {
    return (
        <div className="relative">
            <header className="h-16 w-full sticky top-0 px-6 sm:px-12 backdrop-blur-xl">
                <div className="w-full h-full max-w-5xl mx-auto flex items-center justify-between">
                    <Link
                        className="h-8 aspect-square relative"
                        href="/"
                    >
                        <Image
                            src="/assets/icon.light.png"
                            alt="Logo"
                            className="object-contain"
                            fill
                        />
                    </Link>
                    <div className="flex items-center gap-x-4">
                        <Link
                            href="/account/subscription"
                            className="font-semibold text-zinc-300 hover:text-white transition-all"
                        >
                            Premium
                        </Link>
                        <Link
                            href="/login"
                            className="font-semibold text-zinc-300 hover:text-white transition-all"
                        >
                            Log in
                        </Link>
                        <div className="h-5 w-0.5 rounded-full bg-zinc-300" />
                        <Link
                            href="/sign-up"
                            className="font-semibold text-zinc-300 hover:text-white transition-all"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </header>
            {children}
        </div>
    )
}

export default Layout