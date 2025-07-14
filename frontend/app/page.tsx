'use client'

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChartNoAxesCombined, FolderOutput, LayoutDashboard, MousePointer2, ShieldUser } from "lucide-react";

export default function Home() {
    const router = useRouter()

    return (
        <div>
            <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 flex justify-between items-center px-40 py-4">
                <div>
                    <Image src="/logo.png" alt="BankSync" width={250} height={125} />
                </div>

                <div className="flex flex-row gap-3">
                    <button
                        className="bg-green-500 hover:bg-green-600 active:bg-green-700 active:scale-95 rounded-full text-white font-sans font-semibold tracking-widest px-4 py-2 transition cursor-pointer"
                        onClick={() => router.push('/registration/login')}
                    >
                        Login
                    </button>

                    <button
                        className="bg-transparent hover:bg-gray-200 active:bg-gray-300 active:scale-95 rounded-full text-green-500 font-sans font-semibold tracking-widest border border-green-500 px-4 py-2 transition cursor-pointer"
                        onClick={() => router.push('/registration/signup')}
                    >
                        Sign up
                    </button>
                </div>
            </header>

            <section className="bg-gray-100 pt-39 pb-17 flex-col items-center text-center">
                <h1 className="text-6xl font-sans font-bold">Welcome to</h1>

                <Image src="/name.png" alt="BankSync" width={500} height={250} className="mx-auto" />
                
                <p className="text-lg text-gray-500 w-3/8 mx-auto">
                    A simple, centralized platform to manage all your finances.
                </p>

                <p className="text-lg text-gray-500 w-5/16 mx-auto">
                    <a className="underline decoration-green-500 decoration-2 underline-offset-5">Monitor balances</a>, <a className="underline decoration-green-500 decoration-2 underline-offset-5">track spending</a> and <a className="underline decoration-green-500 decoration-2 underline-offset-5">uncover financial insights</a> across all your accounts — all in one place.
                </p>
            </section>

            <section className="bg-white pt-20 pb-19 flex-col items-center text-center">
                <h1 className="text-5xl font-sans font-bold mb-12">Features</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 px-45">
                    <div className="bg-white shadow-xl p-8 flex flex-col items-center justify-center border border-green-500 border-2 rounded-3xl">
                        <LayoutDashboard className="h-12 w-12 text-green-500 mb-3"/>
                        <h2 className="text-2xl font-bold mb-2">Unified Dashboard</h2>
                        <p className="text-gray-500 text-center w-3/4">Upload your monthly bank statements and combine them into one centralized overview</p>
                    </div>

                    <div className="bg-white shadow-xl p-8 flex flex-col items-center justify-center border border-green-500 border-2 rounded-3xl">
                        <FolderOutput className="h-12 w-12 text-green-500 mb-3"/>
                        <h2 className="text-2xl font-bold mb-2">Seamless Data Export</h2>
                        <p className="text-gray-500 text-center w-3/4">Download statements for offline access or sharing</p>
                    </div>

                    <div className="bg-white shadow-xl p-8 flex flex-col items-center justify-center border border-green-500 border-2 rounded-3xl">
                        <ShieldUser className="h-12 w-12 text-green-500 mb-3"/>
                        <h2 className="text-2xl font-bold mb-2">Secure Authentication</h2>
                        <p className="text-gray-500 text-center w-3/4">Enjoy safe login with Google or GitHub, backed by robust encryption to protect your financial data</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center border border-green-500 border-2 items-center justify-center">
                        <ChartNoAxesCombined className="h-12 w-12 text-green-500 mb-3"/>
                        <h2 className="text-2xl font-bold mb-2">Meaningful Spending Insights</h2>
                        <p className="text-gray-500 text-center w-3/4">Visualise when and where your money is being spent</p>
                    </div>
                </div>
            </section>

            <section className="bg-gray-100 pt-20 pb-9 flex-col items-center text-center">
                <h1 className="text-4xl font-sans font-bold mb-8">Supported Banks</h1>

                <p className="text-lg text-gray-500 w-3/8 mx-auto">
                    BankSync currently supports the uploading of statements from the banks below. 
                </p>

                <p className="text-lg text-gray-500 w-3/8 mx-auto mb-4"> 
                    More will be added soon!
                </p>

                <div className="grid grid-cols-2 px-130">
                    <Image src="/DBS.png" alt="DBS" width={200} height={250} className="mx-auto" />
                    <Image src="/POSB.png" alt="BankSync" width={250} height={250} className="mx-auto" />
                </div>
                <div className="grid grid-cols-3 px-70">
                    <Image src="/OCBC.png" alt="BankSync" width={250} height={250} className="mx-auto" />
                    <Image src="/SC.png" alt="BankSync" width={250} height={250} className="mx-auto" />
                    <Image src="/UOB.png" alt="BankSync" width={250} height={250} className="mx-auto" />
                </div>
            </section>

            <section className="bg-white pt-20 pb-17 flex-col items-center text-center">
                <h1 className="text-5xl font-sans font-bold mb-9">
                    Ready to take control of your finances?
                </h1>

                <p className="text-lg text-gray-500 w-3/8 mx-auto mb-7">
                    Sign up now and start managing your accounts with ease.
                </p>

                <button
                    className="bg-green-500 hover:bg-green-600 active:scale-95 rounded-full text-white font-sans font-semibold tracking-widest px-5 py-3 transition cursor-pointer"
                    onClick={() => router.push('/registration/signup')}
                >
                    <div className="flex flex-row items-center gap-2">
                        <p>Click here to get started</p>
                        <MousePointer2 />
                    </div>
                </button>
            </section>

            <footer className="bg-white pt-5 pb-5 flex items-center justify-center text-center">
                <p className="text-md text-gray-500">
                    &copy; {new Date().getFullYear()} BankSync. All rights reserved.
                </p>
            </footer>
        </div>
    )
}