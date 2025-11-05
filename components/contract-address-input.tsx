'use client'

import { useState } from 'react'
import { Search, AlertCircle, CheckCircle } from 'lucide-react'
import { isValidEthereumAddress } from '@/lib/ethereum'
import { useAuditStore } from '@/lib/store/audit-store'

export function ContractAddressInput() {
  const {
    contractAddress,
    setContractAddress,
    isLoadingContract,
    isLoadingAudit,
    error,
    setError
  } = useAuditStore()
  
  const [inputValue, setInputValue] = useState(contractAddress)
  const [isValid, setIsValid] = useState(false)

  const handleInputChange = (value: string) => {
    setInputValue(value)
    setContractAddress(value)
    
    if (value.trim()) {
      const valid = isValidEthereumAddress(value)
      setIsValid(valid)
      
      if (!valid && value.length >= 10) {
        setError('Please enter a valid Ethereum contract address (0x format, 42 characters)')
      } else {
        setError(null)
      }
    } else {
      setIsValid(false)
      setError(null)
    }
  }

  const isLoading = isLoadingContract || isLoadingAudit

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter Ethereum contract address (0x...)"
          disabled={isLoading}
          className={`
            w-full pl-12 pr-12 py-4 text-lg border-2 rounded-xl
            focus:outline-none focus:ring-2 focus:ring-yellow-300 
            transition-all duration-200
            ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
            ${error ? 'border-red-300' : isValid ? 'border-green-300' : 'border-gray-200'}
            ${error ? 'focus:border-red-500' : isValid ? 'focus:border-green-500' : 'focus:border-yellow-300'}
          `}
        />
        
        {inputValue && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            {error ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : isValid ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : null}
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}