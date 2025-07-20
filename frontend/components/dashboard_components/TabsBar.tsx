"use client"

export type Page = "Overview" | "Accounts" | "Transactions" | "Analytics";

interface TabBarProps {
    currentPage: Page;
    setPage: (page: Page) => void;
}

export default function TabBar({ currentPage, setPage }: TabBarProps) {
    const pages: Page[] = ["Overview", "Accounts", "Transactions", "Analytics"];

    return (
        <div className="transition">
            <ul className="flex flex-wrap">
                {pages.map((tab) => (
                    <li key={tab} className="me-2">
                        <button
                            onClick={() => setPage(tab as Page)}
                            className={`inline-block px-4 py-2 rounded-xl transition cursor-pointer text-2xl text-center
                                ${
                                    currentPage === tab 
                                        ? "bg-green-500 text-white hover:bg-green-600"
                                        : "bg-transparent hover:bg-gray-200 active:bg-gray-300 active:scale-95 hover:text-gray-900"
                                }
                            `}
                            aria-current={currentPage === tab ? "page" : undefined}
                        >
                            {tab}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}