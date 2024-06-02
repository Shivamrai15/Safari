"use client";

import { useRouter } from "next/navigation";
import { 
    Dialog,
    DialogContent
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePremiumModal } from "@/hooks/use-premium-modal";

export const JoinPremiumModal = () => {
    
    const { isPremiumModalOpen, onClosePremiumModal } = usePremiumModal();
    const router = useRouter()

    const handleOnChange = ( open : boolean ) => {
        if ( !open ) {
            onClosePremiumModal();
        }
    }
    
    return (
        <Dialog open={isPremiumModalOpen} onOpenChange={handleOnChange} >
            <DialogContent
                className="max-w-xl w-full rounded-2xl bg-[#CC4C39]"
            >
                <div className="p-6 flex flex-col items-center py-10 space-y-10">
                    <p className="text-center text-3xl md:text-4xl lg:text-5xl font-extrabold md:leading-snug lg:leading-snug ">
                        Create unlimted playlists<br />on Safari Premium
                    </p>
                    <Button
                        className="rounded-full font-bold hover:scale-105 transition-transform duration-300"
                        onClick={() => {
                                router.push('/account/subscription');
                                onClosePremiumModal();
                            }
                        }
                    >
                        Explore Premium
                    </Button> 
                </div>
            </DialogContent>
        </Dialog>
    )
}
