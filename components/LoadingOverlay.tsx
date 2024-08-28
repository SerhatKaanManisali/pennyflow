import { Loader2 } from 'lucide-react'
import React from 'react'

const LoadingOverlay = () => {
  return (
    <div className='loading-overlay'>
      <Loader2 size={64} className="animate-spin text-white z-[1000]" />
    </div>
  )
}

export default LoadingOverlay