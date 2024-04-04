import { Sidebar } from "@/components/navigation/sidebar";

interface LayoutPageProps { 
    children : React.ReactNode
}

const LayoutPage = ({
    children
} : LayoutPageProps ) => {
    return (
        <main className="h-full w-full flex flex-col md:flex-row bg-gradient-to-br from-slate-950 to-neutral-900">
            <div className="hidden md:block w-24 flex-shrink-0 h-full bg-neutral-950/70">
                <Sidebar/>
            </div>    
            <div className="w-full h-[calc(100%-4rem)] md:h-full">
                {children}
            </div>
            <div className="md:hidden w-full h-16 bg-neutral-900">
            </div>
        </main>
    );
}

export default LayoutPage;