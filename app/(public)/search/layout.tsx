import { SearchForm } from "@/components/forms/search-form";

interface SearchLayoutProps {
    children : React.ReactNode;
}

const SearchLayout = ({
    children
} : SearchLayoutProps ) => {
    return (
        <div className="px-4 md:px-20 w-full space-y-10 pb-20 pt-10 md:pb-10 md:pr-32">
            <SearchForm />
            { children }
        </div>
    )
}

export default SearchLayout