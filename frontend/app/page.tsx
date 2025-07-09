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
                        className="bg-green-500 hover:bg-green-600 rounded-full text-white font-sans font-semibold tracking-widest px-4 py-2 transition"
                        onClick={() => router.push('/registration/login')}
                    >
                        Login
                    </button>

                    <button
                        className="bg-transparent hover:bg-gray-200 rounded-full text-green-500 font-sans font-semibold tracking-widest border border-green-500 px-4 py-2 transition"
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
                    A simple, centralized platform to organize all your finances.
                </p>

                <p className="text-lg text-gray-500 w-3/8 mx-auto">
                    <a className="underline decoration-green-500 decoration-2 underline-offset-5">Track spending</a>, <a className="underline decoration-green-500 decoration-2 underline-offset-5">monitor budgets</a> and <a className="underline decoration-green-500 decoration-2 underline-offset-5">gain financial insights</a> more effectively across multiple accounts all in one place.
                </p>
            </section>

            <section className="bg-white pt-20 pb-20 flex-col items-center text-center">
                <h1 className="text-5xl font-sans font-bold mb-12">Features</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 px-45">
                    <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center border border-green-500 border-2 items-center justify-center">
                        <LayoutDashboard className="h-12 w-12 text-green-500 mb-3"/>
                        <h2 className="text-2xl font-bold mb-2">Unified Dashboard</h2>
                        <p className="text-gray-500 text-center w-3/4">Combine your monthly bank statements from all accounts into one centralized overview</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center border border-green-500 border-2 items-center justify-center">
                        <FolderOutput className="h-12 w-12 text-green-500 mb-3"/>
                        <h2 className="text-2xl font-bold mb-2">Seamless Data Export</h2>
                        <p className="text-gray-500 text-center w-3/4">Download statements for offline access or sharing</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center border border-green-500 border-2 items-center justify-center">
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

            <section className="bg-gray-100 pt-13 pb-10 flex-col items-center text-center">
                <h1 className="text-4xl font-sans font-bold mb-8">Supported Banks</h1>

                <p className="text-lg text-gray-500 w-3/8 mx-auto mb-4">
                    BankSync currently supports the following banks. More banks will be added in the future.
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

            <section className="bg-white pt-20 pb-20 flex-col items-center text-center">
                <h1 className="text-5xl font-sans font-bold mb-8">
                    Ready to take control of your finances?
                </h1>

                <p className="text-lg text-gray-500 w-3/8 mx-auto mb-6">
                    Sign up now and start managing your accounts with ease.
                </p>

                <button
                    className="bg-green-500 hover:bg-green-600 rounded-full text-white font-sans font-semibold tracking-widest px-5 py-3 transition"
                    onClick={() => router.push('/registration/signup')}
                >
                    <div className="flex flex-row items-center gap-2">
                        <p>Click here to get started</p>
                        <MousePointer2 />
                    </div>
                </button>
            </section>

            <footer className="bg-white pt-5 pb-10 flex items-center justify-center text-center">
                <p className="text-md text-gray-500">
                    &copy; {new Date().getFullYear()} BankSync. All rights reserved.
                </p>
            </footer>
        </div>
    )
}