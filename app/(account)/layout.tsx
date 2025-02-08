import { Header } from "@/components/account/header";


interface LayoutPageProps {
    children : React.ReactNode;
}

const LayoutPage = ({ children }: LayoutPageProps ) => {

    return (
        <div className="w-full h-full bg-gradient-to-b from-[#171717] to-[#111] to-20%">
            <Header/>
            <div className="h-[calc(100%-5rem)] max-w-3xl px-6 w-full mx-auto">
                {children}
            </div>
        </div>
    )
}

export default LayoutPage;