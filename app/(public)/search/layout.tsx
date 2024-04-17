import { SearchForm } from "@/components/forms/search-form";

interface SearchLayoutProps {
    children : React.ReactNode;
}

const SearchLayout = ({
    children
} : SearchLayoutProps ) => {
    return (
        <div className="px-4 md:px-20 w-full space-y-10 py-10">
            <SearchForm />
            { children }
        </div>
    )
}

export default SearchLayout