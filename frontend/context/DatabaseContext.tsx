import { queryAccountDetails, queryTransactionDetails } from '@/lib/supabaseQuery';
import { Account, Transaction } from '@/utils/types';
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type DatabaseContextType = {
    transactions: Transaction[];
    accounts: Account[];
    refreshDatabase: () => Promise<void>;
    loaded: boolean;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

type DatabaseProviderProps = {
    children: ReactNode;
    userId: string;
};

export const DatabaseProvider = ({ children, userId }: DatabaseProviderProps) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loaded, setLoadingStatus] = useState(false)

    const refreshDatabase = async () => {
        setLoadingStatus(false)
        const newTransactions = await queryTransactionDetails(userId)
        const newAccounts = await queryAccountDetails(userId)
        setTransactions(newTransactions);
        setAccounts(newAccounts);
        setLoadingStatus(true)
    };

    useEffect(() => {
        refreshDatabase()
    }, [])

    return (
        <DatabaseContext.Provider value={{ transactions, accounts, refreshDatabase, loaded }}>
            {children}
        </DatabaseContext.Provider>
    )
};

export const useDatabase = () => {
    const context = useContext(DatabaseContext);
    if (!context) {
        throw new Error('useDatabase must be used within a UserProvider in Dashboard');
    }
    return context;
};

