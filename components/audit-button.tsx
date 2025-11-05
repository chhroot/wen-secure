'use client'

import { Loader2 } from 'lucide-react'
import { isValidEthereumAddress } from '@/lib/ethereum'
import { useAuditStore } from '@/lib/store/audit-store'
import { etherscanService } from '@/lib/services/etherscan'

export function AuditButton() {
  const {
    contractAddress,
    isLoadingContract,
    isLoadingAudit,
    setIsLoadingContract,
    setIsLoadingAudit,
    setContractInfo,
    setAuditResult,
    setError,
    setAuditProgress,
    resetAudit
  } = useAuditStore()

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

  const handleNewAudit = () => {
    resetAudit()
  }

  const auditProgress = useAuditStore(state => state.auditProgress)
  const auditResult = useAuditStore(state => state.auditResult)
  const showNewAuditButton = auditProgress.step === 'complete' || 
                            auditProgress.step === 'error' ||
                            auditResult !== null

  return (
    <div className="flex flex-col items-center gap-4">
      {!showNewAuditButton ? (
        <button
          onClick={handleAudit}
          disabled={!isValidAddress || isLoading}
          className={`
            px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200
            flex items-center gap-3 min-w-[200px] justify-center
            ${!isValidAddress || isLoading 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-400 hover:bg-blue-500 text-white cursor-pointer shadow-lg hover:shadow-xl transform'
            }
          `}
        >
          {isLoading && (
            <Loader2 className="h-5 w-5 animate-spin" />
          )}
          {isLoading ? 'Auditing...' : 'Audit Contract'}
        </button>
      ) : (
        <button
          onClick={handleNewAudit}
          className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200
                     flex items-center gap-3 min-w-[200px] justify-center
                     bg-green-600 hover:bg-green-700 text-white cursor-pointer"
        >
          New Audit
        </button>
      )}
    </div>
  )
}