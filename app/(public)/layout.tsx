import { LayoutWrapper } from "@/components/layout-wrapper";

interface LayoutPageProps { 
    children : React.ReactNode
}

const LayoutPage = ({
    children
} : LayoutPageProps ) => {
    return (
        <LayoutWrapper>
            {children}
        </LayoutWrapper>
    );
}

export default LayoutPage;