"use client"

import { BanknoteArrowUp, ChartPie, CreditCard, PanelsTopLeft } from "lucide-react";

export type Page = "Overview" | "Accounts" | "Transactions" | "Analytics";

interface TabBarProps {
    currentPage: Page;
    setPage: (page: Page) => void;
}

export default function TabBar({ currentPage, setPage }: TabBarProps) {
    const pages: Page[] = ["Overview", "Accounts", "Transactions", "Analytics"];

    const ICONSTYLE = "inline mr-2 lg:w-7 not-lg:w-5"
    const pagesIcon: Record<Page, React.ReactNode> = {
        Overview: <PanelsTopLeft className={ICONSTYLE}/>,
        Accounts: <CreditCard className={ICONSTYLE}/>,
        Transactions: <BanknoteArrowUp className={ICONSTYLE}/>,
        Analytics: <ChartPie className={ICONSTYLE}/>,
    }

    return (
        <div className="transition-all">
            <ul className="flex flex-wrap">
                {pages.map((tab) => (
                    <li key={tab} className="me-2">
                        <button
                            onClick={() => setPage(tab)}
                            className={`inline-block px-4 py-2 rounded-xl transition cursor-pointer text-xl text-center
                                ${
                                    currentPage === tab 
                                        ? "bg-green-500 text-white hover:bg-green-600"
                                        : "bg-transparent hover:bg-gray-200 active:bg-gray-300 active:scale-95"
                                }
                            `}
                            aria-current={currentPage === tab ? "page" : undefined}
                        >
                            <span className="flex items-center lg:text-xl not-xl:text-base">
                                {pagesIcon[tab]} {tab}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}