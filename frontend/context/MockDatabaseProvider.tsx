import { Account, Transaction } from "@/utils/types";
import { ReactNode } from "react";
import { DatabaseContext } from "./DatabaseContext";

type MockProviderProps = {
    children: ReactNode;
    transactions?: Transaction[];
    accounts?: Account[];
    refreshDatabase?: () => Promise<void>;
    loaded?: boolean;
}

export const MockDatabaseProvider = ({
    children,
    transactions = [],
    accounts = [],
    refreshDatabase = async () => {},
    loaded = true,
} : MockProviderProps) => {
    return (
        <DatabaseContext.Provider 
            value={{ transactions, accounts, refreshDatabase, loaded }}
        >
            {children}
        </DatabaseContext.Provider>
    );
}