'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle,
  Download,
  FileText,
  Code,
  Shield,
  Zap,
  Star
} from 'lucide-react'
import { useAuditStore } from '@/lib/store/audit-store'
import { Vulnerability } from '@/lib/services/llm-audit'
import { downloadMarkdown, generatePDF } from '@/lib/utils/export'

const severityIcons = {
  Critical: AlertTriangle,
  High: AlertTriangle,
  Medium: AlertCircle,
  Low: Info
}

const severityColors = {
  Critical: 'text-red-600 bg-red-50 border-red-200',
  High: 'text-red-600 bg-red-50 border-red-200',
  Medium: 'text-orange-600 bg-orange-50 border-orange-200',
  Low: 'text-yellow-600 bg-yellow-50 border-yellow-200'
}

function VulnerabilityCard({ vulnerability }: { vulnerability: Vulnerability }) {
  const SeverityIcon = severityIcons[vulnerability.severity]
  const colorClass = severityColors[vulnerability.severity]

  return (
    <div className={`border rounded-lg p-4 ${colorClass}`}>
      <div className="flex items-start gap-3">
        <SeverityIcon className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-lg">{vulnerability.title}</h4>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/80">
              {vulnerability.severity}
            </span>
          </div>
          
          <p className="text-sm mb-3 leading-relaxed">{vulnerability.description}</p>
          
          {vulnerability.location && (
            <div className="mb-3">
              <span className="text-xs font-medium opacity-75">Location:</span>
              <code className="ml-2 px-2 py-1 bg-white/60 rounded text-sm font-mono">
                {vulnerability.location}
              </code>
            </div>
          )}
          
          <div className="space-y-2">
            <div>
              <span className="text-xs font-medium opacity-75">Impact:</span>
              <p className="text-sm mt-1">{vulnerability.impact}</p>
            </div>
            
            <div>
              <span className="text-xs font-medium opacity-75">Recommendation:</span>
              <p className="text-sm mt-1">{vulnerability.recommendation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AuditResults() {
  const { contractInfo, auditResult, contractAddress } = useAuditStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'vulnerabilities' | 'code' | 'recommendations'>('overview')

  if (!contractInfo || !auditResult) {
    return null
  }

  const handleExportPDF = () => {
    generatePDF(contractInfo, auditResult, contractAddress)
  }

  const handleExportMarkdown = () => {
    downloadMarkdown(contractInfo, auditResult, contractAddress)
  }

  const allVulnerabilities = [
    ...auditResult.criticalVulnerabilities,
    ...auditResult.mediumSeverityIssues,
    ...auditResult.lowSeverityIssues
  ]

  const criticalCount = auditResult.criticalVulnerabilities.length
  const mediumCount = auditResult.mediumSeverityIssues.length
  const lowCount = auditResult.lowSeverityIssues.length

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'vulnerabilities', label: `Issues (${allVulnerabilities.length})`, icon: AlertTriangle },
    { id: 'code', label: 'Source Code', icon: Code },
    { id: 'recommendations', label: 'Recommendations', icon: Star }
  ]

  return (
    <div className="w-full max-w-6xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Security Audit Report
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Code className="w-4 h-4" />
                {contractInfo.contractName}
              </span>
              <span>Compiler: {contractInfo.compilerVersion}</span>
              <span>Optimization: {contractInfo.optimizationUsed ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors"
              onClick={handleExportPDF}
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              onClick={handleExportMarkdown}
            >
              <FileText className="w-4 h-4" />
              Export MD
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {tabs.map((tab) => {
            const TabIcon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'vulnerabilities' | 'code' | 'recommendations')}
                className={`
                  flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'text-yellow-400 border-b-2 border-yellow-300 bg-yellow-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Executive Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Executive Summary
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{auditResult.executiveSummary}</p>
              </div>
            </div>

            {/* Security Overview */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-900">Critical Issues</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-orange-900">Medium Issues</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">{mediumCount}</div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-900">Low Issues</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">{lowCount}</div>
                </div>
              </div>
            </div>

            {/* Code Quality Assessment */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Code Quality Assessment
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{auditResult.codeQualityAssessment}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vulnerabilities' && (
          <div className="space-y-6">
            {criticalCount > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-red-600 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Critical Vulnerabilities ({criticalCount})
                </h3>
                <div className="space-y-4">
                  {auditResult.criticalVulnerabilities.map((vuln, index) => (
                    <VulnerabilityCard key={index} vulnerability={vuln} />
                  ))}
                </div>
              </div>
            )}

            {mediumCount > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-orange-600 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Medium Severity Issues ({mediumCount})
                </h3>
                <div className="space-y-4">
                  {auditResult.mediumSeverityIssues.map((vuln, index) => (
                    <VulnerabilityCard key={index} vulnerability={vuln} />
                  ))}
                </div>
              </div>
            )}

            {lowCount > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-yellow-600 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Low Severity Issues ({lowCount})
                </h3>
                <div className="space-y-4">
                  {auditResult.lowSeverityIssues.map((vuln, index) => (
                    <VulnerabilityCard key={index} vulnerability={vuln} />
                  ))}
                </div>
              </div>
            )}

            {allVulnerabilities.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-600 mb-2">No Security Issues Found</h3>
                <p className="text-gray-600">The contract appears to follow security best practices.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'code' && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Contract Source Code
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <SyntaxHighlighter
                language="solidity"
                style={tomorrow}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}
                showLineNumbers
              >
                {contractInfo.sourceCode}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            {/* Gas Optimizations */}
            {auditResult.gasOptimizations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Gas Optimizations
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <ul className="space-y-2">
                    {auditResult.gasOptimizations.map((optimization, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-blue-800">{optimization}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* General Recommendations */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                General Recommendations
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {auditResult.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-green-800">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}