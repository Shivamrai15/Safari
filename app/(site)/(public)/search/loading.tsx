import { Loader2 } from "lucide-react";


const Loading = () => {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="py-40">
                <Loader2 className="h-10 w-10 animate-spin" color="#252525" />
            </div>
        </div>
    )
}

export default Loading;