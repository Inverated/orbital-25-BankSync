export default function Overview() {
    return(
        <div className="flex flex-col items-center justify-center">
            <div className="p-20 m-5 border border-black">
                Total balance
            </div>
            <div className="flex justify-between">
                <div className="p-50 m-5 border border-black">
                    Income
                </div>
                <div className="p-50 m-5 border border-black">
                    Expenses
                </div>
            </div>
        </div>
    )
}