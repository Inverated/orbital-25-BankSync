import { StatementResponse, uploadReturnData } from "@/utils/types";
import uploadFile from "@/utils/uploadFile";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { MdFileUpload, MdUploadFile } from "react-icons/md";
import PreviewTable from "./PreviewTable";

export default function UploadButton() {
    const [uploadDialogue, setDialogueStatus] = useState(false)
    const [errorFileType, setFileError] = useState(false)
    const currentFile = useRef<File | null>(null)
    const [passwordQuery, setQueryPassword] = useState(false)
    const filePassword = useRef<HTMLInputElement>(null)
    const [statements, setStatements] = useState<StatementResponse[] | null>(null)
    const [activeTab, setActiveTab] = useState(0)

    const handleUploadFile = async () => {
        setActiveTab(0)
        setStatements(null)
        if (currentFile.current != null) {
            const parsedData: uploadReturnData = await uploadFile(currentFile.current, filePassword.current?.value)
            console.log(parsedData)
            if (!parsedData.success) {
                const errorMessage = parsedData.error
                console.log(errorMessage)
                if (errorMessage == 'requirePassword') {
                    setQueryPassword(true)
                } else if (errorMessage == 'invalidPassword') {
                    setQueryPassword(true)
                    alert('Wrong password')
                } else if (errorMessage == 'invalidFile') {
                    alert("Invalid file. Please use a readable file")
                } else if (errorMessage == 'invalidBankType') {
                    alert('Please use documents from supported banks')
                } else {
                    alert(errorMessage)
                    console.log(errorMessage)
                }
                return
            } else {
                setQueryPassword(false)
            }

            setStatements(parsedData.data)
            //console.log('parsed', parsedData)
        }
    }

    const closeDialogue = () => {
        setDialogueStatus(false)
        setFileError(false)
        currentFile.current = null
        setStatements(null)
        setActiveTab(0)
    }

    const setCurrentFile = async (element: ChangeEvent<HTMLInputElement>) => {
        const files = element.target.files
        if (files && files.length > 0) {
            checkFileType(files[0])
        } else {
            currentFile.current = null
        }
    }

    const checkFileType = (file: File) => {
        const fileExt = file.name.slice(file.name.lastIndexOf(".") + 1)
        if (['pdf', 'csv'].includes(fileExt.toLowerCase())) {
            currentFile.current = file
            setFileError(false)
            return
        } else {
            setFileError(true)
            currentFile.current = null
        }
        

    }

    const handleUpdate = useCallback((index: number, updatedItem: StatementResponse) => {
        if (statements) {
            const newStatement = [...statements]
            newStatement[index] = updatedItem
            setStatements(newStatement)
        }
    },[setStatements, statements])

    const handleUploadData = () => {

    }

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            checkFileType(file)
            handleUploadFile()
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault(); // necessary to allow drop
    }

    useEffect(() => {
        const handleButtonDown = (event: KeyboardEvent) => {
        if (event.key == 'Escape') {
            closeDialogue()
        }
    }
        document.addEventListener('keydown', handleButtonDown)
        return () => {
            document.removeEventListener('keydown', handleButtonDown)
        }
    }, [handleUpdate])

    return (
        <div>
            <MdFileUpload
                onClick={() => setDialogueStatus(true)}
                className={'mx-4 border border-black items-center rounded-lg hover:cursor-pointer'} />
            {uploadDialogue &&
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white rounded-lg shadow-lg px-8 py-7 max-w-5/6 w-full z-60 max-h-11/12 overflow-y-auto">
                        <p className="text-2xl mb-3">File Upload</p>
                        <label
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            htmlFor="dropzone-file"
                            className="z-100 flex flex-col items-center justify-center w-full h-32 border-2 border-black border-dashed rounded-lg cursor-pointer hover:bg-gray-300">
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
                                onChange={(e) => {
                                    setCurrentFile(e)
                                    handleUploadFile()
                                }}
                                className="hidden" />
                        </label>

                        {currentFile.current &&
                            <div className="text-sm">
                                <p><b>Uploaded file: </b>{currentFile.current.name}</p>
                                {passwordQuery &&
                                    <p>
                                        <b className="text-red-400">Please enter password: </b>
                                        <input className='border border-black' ref={filePassword} type="password" />
                                    </p>
                                }
                            </div>
                        }

                        {statements &&
                            <div>
                                <div className="flex flex-row justify-start text-sm item">
                                    {statements.map((statement, index) =>
                                        <button
                                            key={index}
                                            className={`px-4 py-2 border-b-2 ${activeTab === index
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-blue-600'
                                                }`}
                                            onClick={() => setActiveTab(index)}
                                        >
                                            {statement.account.account_name}
                                        </button>
                                    )}
                                </div>

                                <PreviewTable
                                    currIndex={activeTab}
                                    transactionData={statements[activeTab].transactions}
                                    accountData={statements[activeTab].account}
                                    onUpdate={handleUpdate}
                                />
                            </div>
                        }

                        {errorFileType && <p className="text-xs italic text-red-600">Please upload the correct file type</p>}
                        <div className="flex justify-end">
                            <button
                                onClick={closeDialogue}
                                className="border border-black mt-4 mx-4 p-1 rounded text-base flex justify-end hover:bg-gray-400 hover:cursor-pointer active:bg-gray-600 active:scale-95 transition"
                            >
                                Close
                            </button>
                            <button
                                disabled={statements === null}
                                onClick={handleUploadData}
                                className="border disabled:border-gray-400 disabled:text-gray-400 border-black mt-4 p-1 rounded text-base flex justify-end not-disabled:hover:bg-gray-400 not-disabled:hover:cursor-pointer not-disabled:active:bg-gray-600 not-disabled:active:scale-95 transition"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}