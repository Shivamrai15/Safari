import { Loader2 } from "lucide-react";


const Loading = () => {
    return (
        <div className="h-[calc(100vh-5rem)] w-full flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin" color="#252525" />
        </div>
    )
}

export default Loading;