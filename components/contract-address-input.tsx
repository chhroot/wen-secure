'use client'

import { useState } from 'react'
import { Loader2, ArrowRight } from 'lucide-react'
import { isValidEthereumAddress } from '@/lib/ethereum'
import { useAuditStore } from '@/lib/store/audit-store'
import { etherscanService } from '@/lib/services/etherscan'
import dynamic from 'next/dynamic'

const TargetCursor = dynamic(() => import('@/components/TargetCursor'), { ssr: false });

export function ContractAddressInput() {
  const {
    contractAddress,
    setContractAddress,
    isLoadingContract,
    isLoadingAudit,
    error,
    setError,
    setIsLoadingContract,
    setIsLoadingAudit,
    setContractInfo,
    setAuditResult,
    setAuditProgress,
    resetAudit,
    auditProgress,
    auditResult
  } = useAuditStore()
  
  const [inputValue, setInputValue] = useState(contractAddress)

  const handleInputChange = (value: string) => {
    setInputValue(value)
    setContractAddress(value)
    
    if (value.trim() && value.length >= 10 && !isValidEthereumAddress(value)) {
      setError('Please enter a valid Ethereum contract address')
    } else {
      setError(null)
    }
  }

  const isValidAddress = isValidEthereumAddress(contractAddress)
  const isLoading = isLoadingContract || isLoadingAudit

  const handleAudit = async () => {
    if (!isValidAddress) {
      setError('Please enter a valid Ethereum contract address')
      return
    }

    setError(null)
    setContractInfo(null)
    setAuditResult(null)

    try {
      setAuditProgress({
        step: 'validating',
        message: 'Validating contract address...'
      })
      setIsLoadingContract(true)

      await new Promise(resolve => setTimeout(resolve, 500))

      setAuditProgress({
        step: 'fetching',
        message: 'Fetching contract source code from Etherscan...'
      })

      const contractInfo = await etherscanService.getContractSourceCode(contractAddress)
      setContractInfo(contractInfo)
      setIsLoadingContract(false)

      setAuditProgress({
        step: 'analyzing',
        message: 'Analyzing contract for security vulnerabilities...'
      })
      setIsLoadingAudit(true)

      const auditResponse = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceCode: contractInfo.sourceCode,
          contractName: contractInfo.contractName
        })
      })

      if (!auditResponse.ok) {
        const errorData = await auditResponse.json()
        throw new Error(errorData.error || 'Failed to perform audit')
      }

      const auditResult = await auditResponse.json()

      setAuditResult(auditResult)
      setIsLoadingAudit(false)

      setAuditProgress({
        step: 'complete',
        message: 'Security audit completed successfully!'
      })

    } catch (error) {
      setIsLoadingContract(false)
      setIsLoadingAudit(false)
      
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(errorMessage)
      
      setAuditProgress({
        step: 'error',
        message: `Audit failed: ${errorMessage}`
      })
    }
  }

  return (
    <div className="w-full md:max-w-2xl mx-auto">
      <TargetCursor hideDefaultCursor={true} />
      <div className="w-full flex flex-col md:flex-row gap-2 items-center border border-neutral-700 p-2">
        {/* Input Field */}
        <div className="flex-1 w-full">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter smart contract address"
            disabled={isLoading}
            className={`
              w-full cursor-target px-6 font-mono py-4 text-lg bg-neutral-900 
              text-neutral-100 placeholder-neutral-500 rounded-none
              focus:outline-none focus:border-neutral-500 
              transition-all duration-200
              ${isLoading ? 'cursor-not-allowed opacity-50' : ''}
              ${error ? 'border-red-500' : ''}
            `}
          />
        </div>

        {/* Audit Button */}
          <button
            onClick={handleAudit}
            disabled={!isValidAddress || isLoading}
            className={`
              px-8 cursor-target py-4 font-mono font-semibold text-lg transition-all duration-200
              flex items-center gap-2 min-w-full md:min-w-[140px] justify-center
              ${!isValidAddress || isLoading 
                ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-neutral-100 cursor-pointer'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Audit
              </>
            ) : (
              <>
                Audit
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
      </div>
      
      {error && (
        <div className="mt-3 text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  )
}