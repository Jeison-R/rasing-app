// src/components/LoadingSpinner.tsx

import React from 'react'
import { HashLoader } from 'react-spinners'

interface LoadingSpinnerProps {
  loading: boolean
}

function LoadingSpinner({ loading }: LoadingSpinnerProps) {
  return (
    <div className="spinner-overlay">
      <HashLoader color="#EE9820" loading={loading} size={50} />
    </div>
  )
}

export default LoadingSpinner
