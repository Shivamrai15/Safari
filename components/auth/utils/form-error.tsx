import { AlertTriangle } from "lucide-react";

interface FormErorrProps {
    message : string;
}

export const FormError = ({
    message
} : FormErorrProps ) => {

    return (
        <div className="bg-destructive p-4 flex items-center gap-x-5 px-6 text-sm text-white cursor-default">
            <AlertTriangle className="h-6 w-6"/>
            <p className="font-medium select-none">{message}</p>
        </div>
    )
}