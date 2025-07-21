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
import { useProfile } from "@/context/ProfileContext";

export default function UploadButton() {
    const [uploadDialogue, setUploadDialogue] = useState(false)
    const [checkDuplicate, setCheckDuplicate] = useState(true)
    const [duplicateShower, setDuplicateShower] = useState(true)

    const [errorMessage, setErrorMessage] = useState('')
    const [errorFileType, setErrorFileType] = useState(false)
    const [showParsingLoading, setShowParsingLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [isUploaded, setIsUploaded] = useState(false)

    const [passwordQuery, setPasswordQuery] = useState(false)
    const filePassword = useRef<HTMLInputElement>(null)
    const passwordConfirmRef = useRef<HTMLButtonElement>(null)

    const currentFile = useRef<File | null>(null)
    const [statements, setStatements] = useState<StatementResponse[] | null>(null)
    const [currAccount, setCurrAccount] = useState<Account[] | undefined>()

    const [activeTab, setActiveTab] = useState(0)

    const router = useRouter()
    const userId = useUserId()
    const { keywordMap } = useProfile()
    const { transactions, accounts, refreshDatabase } = useDatabase()

    const closeDialogue = () => {
        resetValues()
        setUploadDialogue(false)
        setErrorFileType(false)
        currentFile.current = null
        setQueryPassword(false)
        setTimeout(() => setShowTooltip(true), 100)
    }

    const resetValues = () => {
        setIsUploaded(false)
        setShowParsingLoading(false)
        setActiveTab(0)
        setStatements(null)
        setIsUploading(false)
    }

    const handleUploadFile = async () => {
        resetValues()

        if (currentFile.current != null) {
            setPasswordQuery(false)

            if (passwordConfirmRef.current) {
                passwordConfirmRef.current.disabled = true
            }

            setShowParsingLoading(true)
            const result: {
                status: number,
                data: uploadReturnData | null,
                error: Error | null
            } = await uploadNewFile(currentFile.current, filePassword.current?.value)

            setShowParsingLoading(false)

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
                    setPasswordQuery(true)
                } else if (errorMessage == 'Invalid Password') {
                    setPasswordQuery(true)
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
                    .toSorted((fst, snd) => fst.transaction_date > snd.transaction_date ? 1 :
                        fst.transaction_date == snd.transaction_date ? 0 : -1))
                setPasswordQuery(false)
                duplicateChecking(returnedData, transactions)
                setStatementCategory(returnedData, keywordMap)
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
            setErrorFileType(false)
        } else {
            setErrorFileType(true)
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
                statements.forEach(each => each.account.account_no == updatedStatements.account.account_no ? updatedStatements : each)
            } else {
                const newStatement = statements.filter(each => each.account.account_no != updatedStatements.account.account_no)
                if (newStatement.length != 0) {
                    setStatements(newStatement)
                } else {
                    resetValues()
                }
                setActiveTab(0)
            }
        }
    }, [statements])

    const handleUploadData = async () => {
        let unknownAccError = false
        statements?.forEach(statement => {
            if (['Unknown Acc No', ''].indexOf(statement.account.account_no) != -1) {
                unknownAccError = true
            }
        })
        if (unknownAccError) {
            setErrorMessage('All accounts must have an account number. Please fill in the missing details')
            return
        }

        setErrorMessage('')
        setIsUploading(true)
        if (statements == null || statements?.length == 0) {
            setIsUploading(false)
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

        uploadData.forEach(newStatement => {
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

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            checkFileType(file)
            handleUploadFile()
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // necessary to allow drop
    }

    const [showTooltip, setShowTooltip] = useState(true);

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
        <div className="relative group">
            <Upload
                onClick={() => {
                    setDialogueStatus(true);
                    setShowTooltip(false);
                }}
                className={'mx-2 w-8 h-8 items-center rounded-lg hover:cursor-pointer'} 
            />

            {showTooltip && (
                <div className="absolute -top-7 -translate-x-1/2 left-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointers-events-none">
                    Upload your bank statements
                </div>
            )}

            {uploadDialogue &&
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white rounded-lg shadow-lg px-8 py-5 max-w-5/8 w-full z-60 max-h-11/12 overflow-y-auto">
                        <div className="flex flex-row space-x-2 items-center mb-3">
                            <p className="text-2xl">File Upload</p>
                            
                            <Info 
                                onClick={() => alert('Current supported bank: DBS/POSB, OCBC, UOB and SC pdf only or exported files from BankSync.')} 
                                className='hover:cursor-pointer h-6 w-6' 
                            />
                        </div>
                        
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className="z-100 flex flex-col items-center justify-center w-full border-2 border-black border-dashed rounded-lg">
                            <div className="flex flex-col items-center justify-center py-15">
                                <FileUp className="h-9 w-9"/>

                                <p className="pt-5 text-med text-gray-500">
                                    Choose a file or drag & drop it here
                                </p>
                                
                                <p className="pt-1 text-med text-gray-400">
                                    PDF and XLSX format
                                </p>
                                
                                <div className="pt-5">
                                    <button
                                        type="button"
                                        className="bg-green-500 hover:bg-green-600 active:bg-green-700 active:scale-95 rounded-full text-white text-med font-sans font-semibold tracking-widest px-4 py-2 transition cursor-pointer"
                                        onClick={() => document.getElementById("dropzone-file")?.click()}
                                    >
                                        Browse files
                                    </button>
                                </div>
                            </div>

                            <input id="dropzone-file" type="file" name="fileUploadArea"
                                onChange={(e) => {
                                    setCurrentFile(e)
                                    handleUploadFile()
                                }}
                                className="hidden" />
                        </div>

                        {currentFile.current &&
                            <div className="text-sm pt-3">
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
                                            <input className='border border-black'
                                                name="passwordInput"
                                                ref={filePassword}
                                                type="password" />
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
                            <p className="text-green-500" hidden={!isUploaded}>File uploaded</p>
                        </div>
                        {errorFileType && <p className="text-xs italic text-red-600">Please upload the correct file type</p>}
                        <div className="flex flex-row justify-end gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm space-x-2 items-center flex justify-between">
                                    <p>Check for duplicates</p>
                                    <input
                                        name="duplicateChecker"
                                        type="checkbox"
                                        defaultChecked={checkDuplicate}
                                        onClick={e => setCheckDuplicate(e.currentTarget.checked)} />
                                </label>
                                <label className="text-sm space-x-2 items-center flex justify-between">
                                    <p>Show duplicates</p>
                                    <input
                                        name="duplicateShower"
                                        type="checkbox"
                                        defaultChecked={duplicateShower}
                                        onClick={e => setDuplicateShower(e.currentTarget.checked)} />
                                </label>
                            </div>
                            <button
                                disabled={statements === null || uploading}
                                onClick={handleUploadData}
                                className="bg-transparent hover:bg-gray-200 active:bg-gray-300 active:scale-95 rounded-lg text-green-500 font-sans font-semibold tracking-widest border border-green-500 px-4 py-2 transition cursor-pointer"
                            >
                                Upload
                            </button>

                            <button
                                onClick={closeDialogue}
                                className="bg-transparent hover:bg-gray-200 active:bg-gray-300 active:scale-95 rounded-lg text-green-500 font-sans font-semibold tracking-widest border border-green-500 px-4 py-2 transition cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}