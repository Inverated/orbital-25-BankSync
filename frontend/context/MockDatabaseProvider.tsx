import { Account, Transaction } from "@/utils/types";
import { ReactNode, useContext } from "react";
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

export const useDatabase = () => {
    const context = useContext(DatabaseContext);
    if (!context) {
        throw new Error('useDatabase must be used within a UserProvider in Dashboard');
    }
    return context;
};
