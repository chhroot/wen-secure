import { create } from 'zustand'
import { ContractSourceInfo } from '../services/etherscan'
import { AuditResult } from '../services/llm-audit'

export interface AuditState {
  // Contract address
  contractAddress: string
  setContractAddress: (address: string) => void

  // Loading states
  isLoadingContract: boolean
  isLoadingAudit: boolean
  setIsLoadingContract: (loading: boolean) => void
  setIsLoadingAudit: (loading: boolean) => void

  // Contract data
  contractInfo: ContractSourceInfo | null
  setContractInfo: (info: ContractSourceInfo | null) => void

  // Audit results
  auditResult: AuditResult | null
  setAuditResult: (result: AuditResult | null) => void

  // Error handling
  error: string | null
  setError: (error: string | null) => void

  // Progress tracking
  auditProgress: {
    step: 'idle' | 'validating' | 'fetching' | 'analyzing' | 'complete' | 'error'
    message: string
  }
  setAuditProgress: (progress: { step: 'idle' | 'validating' | 'fetching' | 'analyzing' | 'complete' | 'error', message: string }) => void

  // Actions
  resetAudit: () => void
}

export const useAuditStore = create<AuditState>((set) => ({
  // Initial state
  contractAddress: '',
  isLoadingContract: false,
  isLoadingAudit: false,
  contractInfo: null,
  auditResult: null,
  error: null,
  auditProgress: {
    step: 'idle',
    message: ''
  },

  // Setters
  setContractAddress: (address) => set({ contractAddress: address }),
  setIsLoadingContract: (loading) => set({ isLoadingContract: loading }),
  setIsLoadingAudit: (loading) => set({ isLoadingAudit: loading }),
  setContractInfo: (info) => set({ contractInfo: info }),
  setAuditResult: (result) => set({ auditResult: result }),
  setError: (error) => set({ error }),
  setAuditProgress: (progress) => set({ auditProgress: progress }),

  // Actions
  resetAudit: () => set({
    contractAddress: '',
    isLoadingContract: false,
    isLoadingAudit: false,
    contractInfo: null,
    auditResult: null,
    error: null,
    auditProgress: {
      step: 'idle',
      message: ''
    }
  })
}))