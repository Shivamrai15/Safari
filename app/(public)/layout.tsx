interface LayoutPageProps { 
    children : React.ReactNode
}

const LayoutPage = ({
    children
} : LayoutPageProps ) => {
    return (
        <main className="h-full w-full">
            {children}
        </main>
    );
}

export default LayoutPage;