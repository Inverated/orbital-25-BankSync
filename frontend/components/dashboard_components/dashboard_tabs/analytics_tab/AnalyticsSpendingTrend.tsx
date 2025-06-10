import { LineChart } from "lucide-react";

export default function SpendingTrend() {
    return (
        <div className="flex flex-col border border-black p-3 mx-5 rounded-lg gap-2">
            <h1 className="font-bold text-xl">Spending Trends</h1>
            
            <h2>Spending pattern over last _ day/month/year</h2>
            
            <div className="flex flex-col h-[300px] justify-center items-center gap-2">
                <LineChart className="h-12 w-12"/>
                <p className="text-sm text-gray-400">Spending Chart</p>
            </div>
        </div>
    )
}