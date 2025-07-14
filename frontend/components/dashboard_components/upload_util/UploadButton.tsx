'use client'

import { Account, StatementResponse, uploadReturnData } from "@/utils/types";
import { uploadNewFile } from "@/utils/uploadFile";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import PreviewTable from "./PreviewTable";
import { FileUp, Info, Loader, Upload } from "lucide-react";
import setStatementCategory from "@/utils/setStatementCategory";
import { addStatements } from "@/lib/supabaseUpload";
import { useUserId } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useDatabase } from "@/context/DatabaseContext";
import { duplicateChecking } from "@/utils/duplicateTransactionCheck";

export default function UploadButton() {
    const [uploadDialogue, setDialogueStatus] = useState(false)
    const [checkDuplicate, setDuplicateChecker] = useState(true)
    const [duplicateShower, setDuplicateShower] = useState(true)

    const [errorMessage, setErrorMessage] = useState('')
    const [errorFileType, setFileError] = useState(false)
    const [showParsingLoading, setParsingLoading] = useState(false)
    const [uploading, setUploadingStatus] = useState(false)
    const [uploaded, setIsUploaded] = useState(false)

    const [passwordQuery, setQueryPassword] = useState(false)
    const filePassword = useRef<HTMLInputElement>(null)
    const passwordConfirmRef = useRef<HTMLButtonElement>(null)

    const currentFile = useRef<File | null>(null)
    const [statements, setStatements] = useState<StatementResponse[] | null>(null)
    const [currAccount, setCurrAccount] = useState<Account[] | undefined>()

    const [activeTab, setActiveTab] = useState(0)

    const router = useRouter()
    const userId = useUserId();
    const { transactions, accounts, refreshDatabase } = useDatabase()

    const closeDialogue = () => {
        resetValues()
        setDialogueStatus(false)
        setFileError(false)
        currentFile.current = null
        setQueryPassword(false)
    }

    const resetValues = () => {
        setIsUploaded(false)
        setParsingLoading(false)
        setActiveTab(0)
        setStatements(null)
        setUploadingStatus(false)
    }

    const handleUploadFile = async () => {
        resetValues()

        if (currentFile.current != null) {
            setQueryPassword(false)

            if (passwordConfirmRef.current) {
                passwordConfirmRef.current.disabled = true
            }

            setParsingLoading(true)
            const result: {
                status: number,
                data: uploadReturnData | null,
                error: Error | null
            } = await uploadNewFile(currentFile.current, filePassword.current?.value)

            setParsingLoading(false)

            if (result.status == 404) {
                setErrorMessage(result.error ? result.error.message : '')
                resetValues()
                return
            }
            let parsedData = result.data

            if (!parsedData) {
                return
            }

            if (!parsedData.success) {
                const errorMessage = parsedData.error
                if (errorMessage == 'Require Password') {
                    setQueryPassword(true)
                } else if (errorMessage == 'Invalid Password') {
                    setQueryPassword(true)
                    setErrorMessage('Wrong password')
                } else {
                    if (passwordConfirmRef.current) {
                        passwordConfirmRef.current.disabled = true
                    }

                    setErrorMessage(errorMessage)
                    console.error(errorMessage)
                }
                resetValues()
                parsedData = null
                return
            } else {
                const returnedData = parsedData.data
                returnedData.forEach(response => response.transactions
                    .sort((fst, snd) => fst.transaction_date > snd.transaction_date ? 1 :
                        fst.transaction_date == snd.transaction_date ? 0 : -1))
                setQueryPassword(false)
                duplicateChecking(returnedData, transactions)
                setStatementCategory(returnedData)
                setStatements(returnedData)
            }
        }
    }

    const setCurrentFile = async (element: ChangeEvent<HTMLInputElement>) => {
        const files = element.target.files
        // Only picking first file if multiple dragged 
        if (files && files.length > 0) {
            checkFileType(files[0])
        } else {
            resetValues()
            currentFile.current = null
        }
    }

    const checkFileType = (file: File) => {
        const fileExt = file.name.slice(file.name.lastIndexOf(".") + 1)
        if (['pdf', 'xlsx', 'txt'].includes(fileExt.toLowerCase())) {
            currentFile.current = file
            setFileError(false)
            return
        } else {
            setFileError(true)
            resetValues()
            currentFile.current = null
        }
    }

    const handleTransactionUpdate = useCallback((index: number, updatedItem: StatementResponse) => {
        if (statements) {
            const newStatement = [...statements]
            newStatement[index] = updatedItem
            setStatements(newStatement)
        }
    }, [setStatements, statements])

    const handleDelete = useCallback((updatedStatements: StatementResponse) => {
        if (statements) {
            if (updatedStatements.hasData) {
                statements.map(each => each.account.account_no == updatedStatements.account.account_no ? updatedStatements : each)
            } else {
                const newStatement = statements.filter(each => each.account.account_no != updatedStatements.account.account_no)
                if (newStatement.length != 0) {
                    setStatements(newStatement)
                } else {
                    resetValues()
                }

            }
        }
    }, [statements])

    const handleUploadData = async () => {
        setErrorMessage('')
        setUploadingStatus(true)
        if (statements == null || statements?.length == 0) {
            return
        }

        let uploadData: StatementResponse[] = statements.map(each => (
            {
                hasData: each.hasData,
                account: each.account,
                transactions: [...each.transactions]
            })
        )

        if (checkDuplicate) {
            uploadData = uploadData.map(statement => {
                statement.transactions = statement.transactions
                    .filter(each => !each.duplicate)
                return statement
            })
                .filter(statement => {
                    return statement.transactions.length != 0
                })
        }

        uploadData.map(newStatement => {
            const latestAcc = currAccount?.filter(curr => curr.account_no == newStatement.account.account_no)[0]
            if (latestAcc && (newStatement.account.latest_recorded_date < latestAcc.latest_recorded_date)) {
                newStatement.account.balance = latestAcc.balance
            }
        })

        if (uploadData.length != 0) {
            const error = await addStatements(userId, uploadData)
            if (error instanceof Error) {
                setErrorMessage(error.message)
            } else {
                refreshDatabase()
                setIsUploaded(true)
            }
        } else {
            setErrorMessage('No new rows uploaded')
        }
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
        setErrorMessage('')
        setCurrAccount(accounts)
        const handleButtonDown = (event: KeyboardEvent) => {
            if (event.key == 'Escape') {
                closeDialogue()
            }
        }
        document.addEventListener('keydown', handleButtonDown)
        return () => {
            document.removeEventListener('keydown', handleButtonDown)
        }
    }, [handleTransactionUpdate, router, accounts])

    return (
        <div>
            <Upload
                onClick={() => setDialogueStatus(true)}
                className={'mx-2 w-8 h-8 items-center rounded-lg hover:cursor-pointer'} />
            {uploadDialogue &&
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white rounded-lg shadow-lg px-8 py-5 max-w-5/6 w-full z-60 max-h-11/12 overflow-y-auto">
                        <div className="flex flex-row space-x-2">
                            <p className="text-2xl mb-3">File Upload</p>
                            <Info onClick={() => alert('Current supported bank: DBS/POSB, OCBC, UOB and SC pdf only')} className='h-5 hover:cursor-pointer' />
                        </div>
                        <label
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            htmlFor="dropzone-file"
                            className="z-100 flex flex-col items-center justify-center w-full h-32 border-2 border-black border-dashed rounded-lg cursor-pointer hover:bg-gray-300">
                            <div className="flex flex-col items-center justify-center">
                                <FileUp />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                    PDF or XLSX
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
                                <div className="flex items-center justify-center"
                                    hidden={!showParsingLoading}>
                                    <Loader className="animate-spin w-12 h-12 text-blue-500" />
                                </div>
                                {passwordQuery &&
                                    <form onSubmit={(event) => {
                                        event.preventDefault()
                                        handleUploadFile()
                                    }} className="flex justify-between">
                                        <span>
                                            <b className="text-red-400">Please enter password: </b>
                                            <input className='border border-black' ref={filePassword} type="password" />
                                        </span>
                                        <button
                                            ref={passwordConfirmRef}
                                            className="border border-black items-center rounded-sm px-2 flex justify-end hover:bg-gray-400 hover:cursor-pointer active:bg-gray-600 active:scale-95 transition"
                                            type='submit'>Confirm</button>
                                    </form>
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
                                            {statement.account.account_name != '' ? statement.account.account_name : statement.account.account_no}
                                        </button>
                                    )}
                                </div>

                                <PreviewTable
                                    currIndex={activeTab}
                                    statement={statements[activeTab]}
                                    onTransactionUpdate={handleTransactionUpdate}
                                    onDelete={handleDelete}
                                    duplicateChecker={checkDuplicate}
                                    duplicateShower={duplicateShower}
                                />
                            </div>
                        }
                        <div className="flex justify-end text-sm p-2">
                            <p className="text-red-500" hidden={errorMessage == ''}>{errorMessage}</p>
                            <p className="text-green-500" hidden={!uploaded}>File uploaded</p>
                        </div>
                        {errorFileType && <p className="text-xs italic text-red-600">Please upload the correct file type</p>}
                        <div className="flex justify-end">
                            <div className="flex flex-col">
                                <label className="text-xs space-x-2 items-center flex justify-between">
                                    <p>Check for duplicates</p>
                                    <input
                                        type="checkbox"
                                        defaultChecked={checkDuplicate}
                                        onClick={e => setDuplicateChecker(e.currentTarget.checked)} />
                                </label>
                                <label className="text-xs space-x-2 items-center flex justify-between">
                                    <p>Show duplicates</p>
                                    <input
                                        type="checkbox"
                                        defaultChecked={duplicateShower}
                                        onClick={e => setDuplicateShower(e.currentTarget.checked)} />
                                </label>
                            </div>

                            <button
                                onClick={closeDialogue}
                                className="border border-black mx-4 p-1 rounded text-base flex justify-end hover:bg-gray-400 hover:cursor-pointer active:bg-gray-600 active:scale-95 transition"
                            >
                                Close
                            </button>
                            <button
                                disabled={statements === null || uploading}
                                onClick={handleUploadData}
                                className="border disabled:border-gray-400 disabled:text-gray-400 border-black p-1 rounded text-base flex justify-end not-disabled:hover:bg-gray-400 not-disabled:hover:cursor-pointer not-disabled:active:bg-gray-600 not-disabled:active:scale-95 transition"
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