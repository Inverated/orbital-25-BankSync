import Analytics_DatePicker from "./Analytics_DatePicker";

export default function Analytics() {
    return(
        <div className="flex flex-col">
            <div className="self-start border border-black p-3 m-3 rounded-lg flex flex-row items-center gap-2">
                <p>Date: </p>
                <Analytics_DatePicker label="Start Date" />
                <p>to</p>
                <Analytics_DatePicker label="End Date" />
            </div>

            <div className="border order-black p-3 m-3 rounded-lg flex flex-row items-center justify-center">
                <h1>Spending Trends</h1>
            </div>
            
            <div className="flex flex-row items-center justify-center">
                <div className="border order-black p-3 m-3 rounded-lg flex-1">
                    <h1>Spending by Category</h1>
                </div>
                
                <div className="border order-black p-3 m-3 rounded-lg flex-1">
                    <h1>Income vs Expenses</h1>
                </div>
            </div>
        </div>
    )
}