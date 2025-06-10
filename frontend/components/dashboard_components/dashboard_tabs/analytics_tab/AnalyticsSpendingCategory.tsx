import { PieChart } from "lucide-react";

export default function SpendingCategory() {
    return (
        <div className="border border-black p-3 rounded-lg flex-1 flex flex-col gap-2">
            <h1 className="font-bold">Spending by Category</h1>
        
            <div className="flex flex-col h-[300px] justify-center items-center gap-2">
                <PieChart className="h-12 w-12"/>
                <p className="text-sm text-gray-400">Category Breakdown Chart</p>
            </div>
        </div>
    )
}