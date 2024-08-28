'use client'

import React, { createContext, useState, useContext, Dispatch, SetStateAction, ReactNode } from 'react';
import LoadingOverlay from './LoadingOverlay';

interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
}

interface LoadingProviderProps {
    children: ReactNode;
}

const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    setIsLoading: () => { },
});

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
            {isLoading && <LoadingOverlay />}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
