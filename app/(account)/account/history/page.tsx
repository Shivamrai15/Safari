"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { ButtonWrapper } from "@/components/utils/button-wrapper";
import { PreviousButton } from "@/components/utils/previous-button";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const AccountHistoryPage = () => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDeleteHistory = async() => {
        try {
            setLoading(true);
            await axios.delete('/api/v1/user/history');
            toast.success("Your history has been be deleted");
            setOpen(false);
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <main className="min-h-full w-full py-20 flex justify-center">
                <div className="space-y-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold select-none" >Delete Your History</h2>
                    <div className="space-y-12">
                        <p className="font-medium select-none cursor-default">Deleting your listening history is irreversible and may impact your song recommendations and other personalized features. To listen anonymously, consider using Private Sessions. If you are sure you want to proceed, click the button below.</p>
                        <ButtonWrapper
                            onClick={()=>setOpen(true)}
                            label="Delete"
                            className="px-10 text-lg"
                        />
                    </div>
                </div>
            </main>
            <AlertModal
                disabled = {loading}
                action="Delete"
                description="Are you sure to delete your listening history"
                isOpen = {open}
                setOpen={setOpen}
                onConfirm={handleDeleteHistory}
                title="Delete your history?"
            />
        </>
    )
}

export default AccountHistoryPage