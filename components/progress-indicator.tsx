'use client'

import { CheckCircle, Loader2, AlertCircle, Search, Code, Shield } from 'lucide-react'
import { useAuditStore } from '@/lib/store/audit-store'

const steps = [
  { key: 'validating', label: 'Validating', icon: Search },
  { key: 'fetching', label: 'Fetching Code', icon: Code },
  { key: 'analyzing', label: 'Analyzing', icon: Shield }
]

export function ProgressIndicator() {
  const { auditProgress, isLoadingContract, isLoadingAudit } = useAuditStore()
  
  if (auditProgress.step === 'idle') {
    return null
  }

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.key === auditProgress.step)
  }

  const currentStepIndex = getCurrentStepIndex()
  const isLoading = isLoadingContract || isLoadingAudit

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* Progress message */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {auditProgress.step === 'complete' && 'Audit Complete!'}
          {auditProgress.step === 'error' && 'Audit Failed'}
          {isLoading && 'Auditing Contract...'}
        </h3>
        <p className="text-gray-600">{auditProgress.message}</p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const isActive = index === currentStepIndex
          const isCompleted = index < currentStepIndex || auditProgress.step === 'complete'
          const isCurrent = index === currentStepIndex && isLoading

          return (
            <div key={step.key} className="flex flex-col items-center">
              {/* Step icon */}
              <div className={`
                relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200
                ${isCompleted 
                  ? 'bg-green-100 border-green-500' 
                  : isActive 
                    ? 'bg-yellow-100 border-yellow-300' 
                    : 'bg-gray-100 border-gray-300'
                }
              `}>
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-6 h-6 text-yellow-300 animate-spin" />
                ) : (
                  <StepIcon className={`w-6 h-6 ${isActive ? 'text-yellow-300' : 'text-gray-400'}`} />
                )}
              </div>

              {/* Step label */}
              <span className={`
                mt-2 text-sm font-medium
                ${isCompleted 
                  ? 'text-green-600' 
                  : isActive 
                    ? 'text-yellow-300' 
                    : 'text-gray-400'
                }
              `}>
                {step.label}
              </span>

              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className={`
                  absolute top-6 left-12 w-full h-0.5 -z-10
                  ${isCompleted ? 'bg-green-300' : 'bg-gray-200'}
                `} style={{ width: 'calc(100% - 3rem)' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className={`
            h-2 rounded-full transition-all duration-500 ease-out
            ${auditProgress.step === 'complete' 
              ? 'bg-green-500' 
              : auditProgress.step === 'error'
                ? 'bg-red-500'
                : 'bg-yellow-300'
            }
          `}
          style={{ 
            width: `${
              auditProgress.step === 'complete' 
                ? 100 
                : auditProgress.step === 'error'
                  ? 100
                  : ((currentStepIndex + 1) / steps.length) * 100
            }%` 
          }}
        />
      </div>

      {/* Error state */}
      {auditProgress.step === 'error' && (
        <div className="flex items-center justify-center text-red-600 gap-2">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Please try again or check your inputs</span>
        </div>
      )}

      {/* Success state */}
      {auditProgress.step === 'complete' && (
        <div className="flex items-center justify-center text-green-600 gap-2">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Review your security audit report below</span>
        </div>
      )}
    </div>
  )
}