'use client'

import React, { createContext, useState, useContext, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export const LoadingOverlay = () => {
    return (
      <div className='loading-overlay'>
        <Loader2 size={64} className="animate-spin text-white z-[1000]" />
      </div>
    )
  }

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