import React, { createContext, useContext, useState, ReactNode } from 'react';

const UserContext = createContext<string | null>(null);

type UserProviderProps = {
  children: ReactNode;
  userId: string;
};

export const UserProvider = ({ children, userId }: UserProviderProps) => {
  return (
    <UserContext.Provider value={ userId }>
      {children}
    </UserContext.Provider>
  );
};

export const useUserId = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider in Dashboard');
  }
  return context;
};
