'use client'

import { Loader2 } from 'lucide-react'
import { useAuditStore } from '@/lib/store/audit-store'
import { HyperText } from './ui/hyper-text-simple'
import { useState, useEffect } from 'react'

const FUNNY_MESSAGES = [
  "Still crunching numbers... grab a coffee",
  "This contract has more layers than an onion",
  "Checking every nook and cranny...",
  "Even our AI needs a moment to think",
  "This is taking longer than expected... patience grasshopper",
  "Diving deep into the blockchain rabbit hole",
  "Quality takes time... unlike fast food",
  "Rome wasn't built in a day, neither is a good audit",
  "This contract is giving us a workout",
  "Hold tight, we're almost there... probably",  
  "Reading the fine print nobody reads",
  "This code is longer than a CVS receipt",
  "Summoning the security gods... they're busy",
  "Checking if you remembered to lock your funds",
  "Plot twist: the real treasure was the audit we made along the way",
  "Still faster than Ethereum gas fees settling",
  "Your contract is being peer-reviewed by a very judgmental AI",
  "Counting all those zeros in your token supply",
  "Making sure your contract isn't a rug pull... yet",
  "This is what happens when you write clean code... it takes forever",
  "Our AI is debating with itself about best practices",
  "Checking for vulnerabilities and existential dread",
  "Still analyzing... have you tried turning it off and on again?",
  "This audit is taking longer than the bear market",
  "Reading your comments... wait, there are no comments",
  "Our hamsters are running as fast as they can",
  "Blockchain never sleeps, but our servers wish they could",
  "Checking if your contract passes the vibe check",
  "Still going... this is basically a marathon now",
  "Your patience stat just leveled up",
  "Searching for bugs like Where's Waldo",
  "This contract has more functions than a Swiss Army knife",
  "Audit speedrun: any% (not going well)"
]

export function ProgressIndicator() {
  const { auditProgress, isLoadingContract, isLoadingAudit } = useAuditStore()
  const [showFunnyMessages, setShowFunnyMessages] = useState(false)
  const [currentFunnyIndex, setCurrentFunnyIndex] = useState(0)
  
  const isLoading = isLoadingContract || isLoadingAudit
  
  useEffect(() => {
    if (!isLoading) {
      setShowFunnyMessages(false)
      setCurrentFunnyIndex(0)
    }
  }, [isLoading])
  
  useEffect(() => {
    if (!isLoading) return
    
    const timer = setTimeout(() => {
      setShowFunnyMessages(true)
    }, 6000) 
    
    return () => clearTimeout(timer)
  }, [isLoading])
  
  useEffect(() => {
    if (!showFunnyMessages) return
    
    const interval = setInterval(() => {
      setCurrentFunnyIndex((prev) => (prev + 1) % FUNNY_MESSAGES.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [showFunnyMessages])
  
  const shouldShow = auditProgress.step !== 'idle' && isLoading

  const getProgressText = () => {
    if (showFunnyMessages) {
      return FUNNY_MESSAGES[currentFunnyIndex]
    }
    
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
        return 'Loading...'
    }
  }

  const progressText = getProgressText()

  return (
    <div className="w-full max-w-2xl mx-auto h-8 flex items-center justify-center">
      <div 
        className={`text-center transition-opacity duration-300 ${
          shouldShow ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {shouldShow && (
          <HyperText 
            key={showFunnyMessages ? currentFunnyIndex : auditProgress.step}
            duration={300}
            className="text-neutral-400 text-lg animate-pulse font-mono"
          >
            {progressText}
          </HyperText>
        )}
      </div>
    </div>
  )
}