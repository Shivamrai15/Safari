"use client";

import { 
    Dialog,
    DialogContent
} from "@/components/ui/dialog";
import NumberTicker from "@/components/ui/number-ticker";

interface ArtistDescriptionProps {
    name : string;
    views : number;
    about : string;
    isOpen: boolean;
    onClose : ()=>void;
}

export const ArtistDescriptionModal = ({
    name,
    views,
    about,
    isOpen,
    onClose
} : ArtistDescriptionProps ) => {

    const handleOnOpenChange = ( open:boolean ) =>{
        if( !open ) {
            onClose();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOnOpenChange} >
            <DialogContent  className="bg-neutral-950 p-0 max-h-[30rem] h-full overflow-hidden max-w-2xl w-full">
                <div className="h-full bg-transparent overflow-y-auto w-full about-scroll">
                    <div className="bg-neutral-950 h-44 w-full relative">
                        <div className="h-full px-6 md:px-10 flex flex-col justify-center space-y-2">
                            <h2 className="text-3xl md:text-4xl font-extrabold select-none">
                                {name}
                            </h2>
                            <span className="font-medium text-zinc-400 select-none" >Description</span>
                        </div>
                        <span className="h-1.5 w-16 rounded-full bg-neutral-600 hover:bg-neutral-500 transition-all absolute left-1/2 bottom-1 -translate-x-1/2" />
                    </div>
                    <div className="py-10 px-6 md:px-10 space-y-10">
                        <div className="flex flex-col space-y-1">

                            <p className="text-3xl md:text-4xl font-extrabold select-none" >
                                <NumberTicker value={views} />
                            </p>
                            <span className="select-none font-medium">Views</span>
                        </div>
                        <p className="text-zinc-300 select-none">
                            {about}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
