import { auth } from "@/auth";
import { PoliciesHeader } from "@/components/utils/policies-header";


interface LayoutProps {
   children : React.ReactNode; 
}

const Layout = async({ children } : LayoutProps) => {

    const session = await auth();

    return (
        <div className="relative">
            <PoliciesHeader isAuthenticated={!!session} />
            {children}
        </div>
    )
}

export default Layout