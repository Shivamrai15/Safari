import { HistoryList } from "@/components/history/history-list";


const HistoryPage = () => {
    return (
        <div className="px-6 md:px-20 w-full flex justify-center pb-20 pt-10 md:pb-10 md:pr-32">
            <div className="max-w-2xl w-full space-y-10">
                <h2 className="text-3xl md:text-5xl font-extrabold pt-10 select-none">Your History</h2>
                <HistoryList/>
            </div>
        </div>
    )
}

export default HistoryPage;