'use client'

import React, { createContext, useState, useContext, useEffect } from 'react';
import LoadingOverlay from './LoadingOverlay';
import { usePathname } from 'next/navigation';

const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    setIsLoading: () => { },
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const pathName = usePathname();
    useEffect(() => setIsLoading(false), [pathName]);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
            {isLoading && <LoadingOverlay />}
        </LoadingContext.Provider>
    );
};