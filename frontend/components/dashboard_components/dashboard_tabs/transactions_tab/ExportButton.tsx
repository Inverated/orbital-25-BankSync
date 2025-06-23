import { useState } from "react"


export default function ExportButton() {
    const [exportDialogue, setExportDialogue] = useState(false)

    const handleFilter = () => {
        
    }

    return (
        <div>
            <button className='border border-black mx-3 py-2 px-3 rounded-lg hover:cursor-pointer hover:bg-gray-400 active:bg-gray-500 active:scale-97 transition'
                onClick={() => setExportDialogue(true)}>
                Export
            </button>
            {exportDialogue && 
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white rounded-lg shadow-lg px-8 py-7 max-w-5/6 w-full z-60 max-h-11/12 overflow-y-auto">
                        <p className="text-2xl mb-3">Export</p>
                        

                        <div className="flex justify-end">
                            <button
                                onClick={() => setExportDialogue(false)}
                                className="border border-black mt-4 mx-4 p-1 rounded text-base flex justify-end hover:bg-gray-400 hover:cursor-pointer active:bg-gray-600 active:scale-95 transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleFilter}
                                className="border disabled:border-gray-400 disabled:text-gray-400 border-black mt-4 p-1 rounded text-base flex justify-end not-disabled:hover:bg-gray-400 not-disabled:hover:cursor-pointer not-disabled:active:bg-gray-600 not-disabled:active:scale-95 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}