"use client";

import { 
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


interface AlertModalProps {
    isOpen: boolean;
    setOpen : ( value : boolean )=>void;
    onConfirm : ()=>void;
    title : string;
    description : string;
    action : string;
    disabled : boolean;
}


export const AlertModal = ({
    isOpen,
    setOpen,
    onConfirm,
    title,
    description,
    action,
    disabled
} : AlertModalProps ) => {
    
    const handleClose = ( open : boolean ) => {
        if ( !open ) {
            setOpen(false);
        }
    }

    return (
        <Dialog open = {isOpen} onOpenChange={handleClose} >
            <DialogContent className="bg-white max-w-96 w-full rounded-lg">
                <div className="w-full space-y-8 my-3">
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
                        <p className="text-sm font-medium text-zinc-700">{description}</p>
                    </div>
                    <div className="flex items-center justify-end gap-x-6" >
                        <button 
                            className="h-10 text-zinc-800 hover:bg-white hover:text-zinc-900 font-semibold" 
                            onClick={()=>setOpen(false)}
                        >
                            Cancel
                        </button>
                        <Button 
                            className="h-12 px-8 font-semibold rounded-full bg-red-600 hover:bg-red-600/90 text-white"
                            disabled = { disabled }
                            onClick={onConfirm}
                        >
                            {action}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
