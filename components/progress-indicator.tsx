'use client'

import { Loader2 } from 'lucide-react'
import { useAuditStore } from '@/lib/store/audit-store'
import { HyperText } from './ui/hyper-text-simple'

export function ProgressIndicator() {
  const { auditProgress, isLoadingContract, isLoadingAudit } = useAuditStore()
  
  const isLoading = isLoadingContract || isLoadingAudit
  
  if (auditProgress.step === 'idle' || !isLoading) {
    return null
  }

  const getProgressText = () => {
    switch (auditProgress.step) {
      case 'validating':
        return 'Validating Contract...'
      case 'fetching':
        return 'Fetching Contract Smart Code...'
      case 'analyzing':
        return 'Analyzing code for vulnerabilities...'
      case 'complete':
        return 'Generating Report...'
      default:
        return null
    }
  }

  const progressText = getProgressText()

  if (!progressText) {
    return null
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center">
        <HyperText 
          key={auditProgress.step}
          duration={200}
          className="text-neutral-400 text-lg animate-pulse font-mono"
        >
          {progressText}
        </HyperText>
      </div>
    </div>
  )
}