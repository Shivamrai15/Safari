import { CheckCircle2 } from "lucide-react";

interface FormSuccessProps {
    message : string
}

export const FormSuccess = ({
    message
} : FormSuccessProps ) => {
    return (
        <div className="bg-green-600 p-4 flex items-center gap-x-5 px-6 text-sm text-white cursor-default">
            <CheckCircle2 className="h-6 w-6"/>
            <p className="font-medium">{message}</p>
        </div>
    );
}