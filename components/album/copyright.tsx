import { Label } from "@prisma/client"
import { format } from "date-fns";

interface CopyrightProps {
    label : Label|null;
    date : Date
}

export const Copyright = ({
    label,
    date
} : CopyrightProps ) => {

    if ( !label ) {
        return null;
    }
    
    return (
        <div className="w-full flex flex-col gap-y-1 px-4 md:px-20 py-8 text-zinc-200">
            <span className="font-semibold select-none">
                {format(new Date(date), "MMMM d, yyyy")}
            </span>
            <div className="space-y-1 text-xs select-none">
                &copy; {label.name}
            </div>
        </div>
    )
}
