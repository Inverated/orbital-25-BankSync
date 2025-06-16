import { Account, Transaction } from "@/utils/types";
import uploadFile from "@/utils/uploadFile";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { MdFileUpload, MdUploadFile } from "react-icons/md";
import PreviewTable from "./PreviewTable";

export default function UploadButton() {
    const [uploadDialogue, setDialogueStatus] = useState(false)
    const [errorFileType, setFileError] = useState(false)
    const [currentFile, setFile] = useState<File | null>(null)
    const [passwordQuery, setQueryPassword] = useState(false)
    const filePassword = useRef<HTMLInputElement>(null)
    const [transactionData, setTransactionData] = useState<Partial<Transaction>[] | null>(null)
    const [accountData, setaccountData] = useState<Partial<Account> | null>(null)

    const handleButtonDown = (event: KeyboardEvent) => {
        if (event.key == 'Escape') {
            closeDialogue()
        }
    }

    const handleUpload = async () => {
        if (currentFile != null) {
            const parsedData = await uploadFile(currentFile, filePassword.current?.value)

            if (!parsedData.success && parsedData.data.requirePassword) {
                setQueryPassword(true)
                if (parsedData.data.invalidPassword) alert('Wrong password')
                return
            } else {
                setQueryPassword(false)
            }
            if (parsedData.data.hasData) {
                setTransactionData(parsedData.data.transactions)
                setaccountData(parsedData.data.account)
            }
            //console.log('parsed', parsedData)
        }
    }

    const closeDialogue = () => {
        setDialogueStatus(false)
        setFileError(false)
        setFile(null)
        setTransactionData(null)
        setaccountData(null)
    }

    const setCurrentFile = (element: ChangeEvent<HTMLInputElement>) => {
        const file = element.target.files
        //console.log(file)
        if (file && file.length > 0) {
            const fileExt = file[0].name.slice(file[0].name.lastIndexOf(".") + 1)
            if (['pdf', 'csv'].includes(fileExt.toLowerCase())) {
                setFile(file[0])
                setFileError(false)
                return
            } else {
                setFileError(true)
            }
        }
        setFile(null)
    }

    useEffect(() => {
        document.addEventListener('keydown', handleButtonDown)
        return () => {
            document.removeEventListener('keydown', handleButtonDown)
        }
    }, [])

    return (
        <div>
            <MdFileUpload
                onClick={() => setDialogueStatus(true)}
                className={'mx-4 border border-black items-center rounded-lg hover:cursor-pointer'} />
            {uploadDialogue &&
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white rounded-lg shadow-lg px-8 py-7 max-w-3xl w-full z-60">
                        <p className="text-2xl mb-3">File Upload</p>

                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-black border-dashed rounded-lg cursor-pointer hover:bg-gray-300">
                            <div className="flex flex-col items-center justify-center">
                                <MdUploadFile />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                    PDF or CSV
                                </p>
                            </div>
                            <input id="dropzone-file" type="file"
                                onChange={(e) => setCurrentFile(e)}
                                className="hidden" />
                        </label>

                        {currentFile &&
                            <div className="text-sm">
                                <p><b>Uploaded file: </b>{currentFile.name}</p>
                                {passwordQuery &&
                                    <p>
                                        <b className="text-red-400">Please enter password: </b>
                                        <input className='border border-black' ref={filePassword} type="password" />
                                    </p>
                                }
                            </div>
                        }

                        {transactionData && <PreviewTable transactionData={transactionData} accountData={accountData} />}

                        {errorFileType && <p className="text-xs italic text-red-600">Please upload the correct file type</p>}
                        <div className="flex justify-end">
                            <button
                                onClick={closeDialogue}
                                className="border border-black mt-4 mx-4 p-1 rounded text-base flex justify-end hover:bg-gray-400 hover:cursor-pointer active:bg-gray-600 active:scale-95 transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleUpload}
                                className="border border-black mt-4 p-1 rounded text-base flex justify-end hover:bg-gray-400 hover:cursor-pointer active:bg-gray-600 active:scale-95 transition"
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