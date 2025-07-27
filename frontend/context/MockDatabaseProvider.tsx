import React, { ReactNode } from 'react';
import { DatabaseContext } from './DatabaseContext';

const defaultValue = {
    transactions: [],
    accounts: [],
    refreshDatabase: async () => { },
    loaded: true,
};

export const MockDatabaseProvider = ({
    children,
    transactions = defaultValue.transactions,
    accounts = defaultValue.accounts,
    refreshDatabase = defaultValue.refreshDatabase,
    loaded = defaultValue.loaded,
}: {
    children: ReactNode;
    transactions?: any[];
    accounts?: any[];
    refreshDatabase?: () => Promise<void>;
    loaded?: boolean;
}) => {
    return (
        <DatabaseContext.Provider
            value={{ transactions, accounts, refreshDatabase, loaded }}
        >
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => {
    const context = React.useContext(DatabaseContext);
    if (!context) {
        throw new Error(
            'useDatabase must be used within a UserProvider in Dashboard'
        );
    }
    return context;
};
