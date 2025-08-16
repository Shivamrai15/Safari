import Link from "next/link";
import { Circle, XCircleIcon } from "lucide-react";
import { Service } from "@/types";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export const Status = () => {
    return (
        <div className='pt-16'>
            <Suspense
                fallback={
                    <Skeleton className="h-8 w-48" />
                }
            >
                <ServerComponent/>
            </Suspense>
            
        </div>
    )
}


type Response = {
  status: string;
  data: Service[];
};

const getOverallStatus = (services: Service[]) => {
    const allUp = services.every(
        (service) =>
        service.statuses.length > 0 &&
        service.statuses[service.statuses.length - 1].status === "up"
    );
    return allUp ? {
        status: true,
        message : "All Systems Operational"
    } : {
        status : false,
        message : "Some Systems Degraded"
    }
};

const ServerComponent = async() => {
    
    const response = await fetch(
      "https://status.shivamrai6836.workers.dev/api/status",
      {
        cache : "no-store"
      }
    );

    if (!response.ok) {
      return  (
        <div className="text-red-600 flex items-center gap-x-2">
            <XCircleIcon className="size-4" />
            <span className="text-sm font-medium">Failed to fetch system status</span>
        </div>
      )
    }

    const data: Response = await response.json();
    const overallStatus = getOverallStatus(data.data);

    return (
        <Link 
            className={cn(
                "px-4 py-2 hover:bg-neutral-800/30 transition-all rounded-md w-fit flex items-center gap-x-2",
                overallStatus.status ? "text-emerald-600" : "text-red-600"
            )}
            href="https://safari-status.vercel.app/"
            target="_blank"
        >
            <Circle className="size-2 fill-current"/>
            <span className="font-medium text-sm">
                {overallStatus.message}
            </span>
        </Link>
    )
}