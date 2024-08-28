'use client'

import { useEffect } from 'react'
import { useLoading } from './LoadingOverlayContext';

const LoadingOverlayManager = () => {
    const {setIsLoading} = useLoading();

    useEffect(() => {
        return () => setIsLoading(false);
      }, []);

  return null;
}

export default LoadingOverlayManager