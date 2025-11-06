'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
    Star,
} from 'lucide-react';
import { useAuditStore } from '@/lib/store/audit-store';
import { downloadMarkdown, generatePDF } from '@/lib/utils/export';
import { BlurFade } from './ui/blur-fade';

export function AuditResults() {
    const { contractInfo, auditResult, contractAddress } = useAuditStore();
    const [activeTab, setActiveTab] = useState<
        'overview' | 'vulnerabilities' | 'code' | 'recommendations'
    >('overview');

    if (!contractInfo || !auditResult) {
        return null;
    }

    const handleExportPDF = () => {
        generatePDF(contractInfo, auditResult, contractAddress);
    };

    const handleExportMarkdown = () => {
        downloadMarkdown(contractInfo, auditResult, contractAddress);
    };

    const allVulnerabilities = [
        ...auditResult.criticalVulnerabilities,
        ...auditResult.mediumSeverityIssues,
        ...auditResult.lowSeverityIssues,
    ];

    const criticalCount = auditResult.criticalVulnerabilities.length;
    const mediumCount = auditResult.mediumSeverityIssues.length;
    const lowCount = auditResult.lowSeverityIssues.length;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Shield },
        {
            id: 'vulnerabilities',
            label: `Issues (${allVulnerabilities.length})`,
            icon: AlertTriangle,
        },
        { id: 'code', label: 'Source Code', icon: Code },
        { id: 'recommendations', label: 'Recommendations', icon: Star },
    ];

    return (
        <div className="max-w-6xl text-neutral-50 font-grotesk">
          <BlurFade>
             <div className="w-full  mx-auto bg-neutral-900 ">
                {/* Header */}
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">
                                Security Audit Report
                            </h2>
                            <div className="flex items-start md:items-center gap-4 text-xs md:text-sm text-neutral-400/90">
                                <span className="flex items-center gap-1">
                                    <Code className="w-4 h-4" />
                                    {contractInfo.contractName}
                                </span>
                                <span>
                                    Compiler: {contractInfo.compilerVersion}
                                </span>
                                <span>
                                    Optimization:{' '}
                                    {contractInfo.optimizationUsed
                                        ? 'Enabled'
                                        : 'Disabled'}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2 md:self-start self-end">
                            <button
                                className="cursor-target cursor-pointer flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-neutral-300 transition-colors"
                                onClick={handleExportPDF}
                            >
                                <Download className="w-4 h-4" />
                                Export PDF
                            </button>
                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-600 text-white hover:bg-zinc-700 transition-colors cursor-target cursor-pointer"
                                onClick={handleExportMarkdown}
                            >
                                <FileText className="w-4 h-4" />
                                Export MD
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="">
                    <nav className="flex overflow-y-auto">
                        {tabs.map((tab) => {
                            const TabIcon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() =>
                                        setActiveTab(
                                            tab.id as
                                                | 'overview'
                                                | 'vulnerabilities'
                                                | 'code'
                                                | 'recommendations'
                                        )
                                    }
                                    className={`
                  flex cursor-target text-nowrap items-center gap-2 px-6 py-4 font-mono font-semibold text-sm transition-colors
                  ${
                      activeTab === tab.id
                          ? 'text-white border-b-2 border-white bg-neutral-600/50'
                          : 'text-neutral-500 border-b-2 border-transparent hover:text-nuetral-900 hover:bg-nuetral-50 cursor-pointer'
                  }
                `}
                                >
                                    <TabIcon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-6 text-neutral-50">
                            {/* Executive Summary */}
                            <div>
                                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                    Executive Summary
                                </h3>
                                <div className="">
                                    <p className="leading-relaxed text-lg">
                                        {auditResult.executiveSummary}
                                    </p>
                                </div>
                            </div>

                            {/* Security Overview */}
                            <div>
                                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                    Security Overview
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="border-2 border-red-600 p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-red-600">
                                                Critical Issues
                                            </span>
                                        </div>
                                        <div className="text-3xl font-bold text-red-600">
                                            {criticalCount}
                                        </div>
                                    </div>

                                    <div className="border-2 border-yellow-600 p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-yellow-600">
                                                Medium Issues
                                            </span>
                                        </div>
                                        <div className="text-3xl font-bold text-yellow-600">
                                            {mediumCount}
                                        </div>
                                    </div>

                                    <div className="border-2 border-emerald-600 p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-emerald-600">
                                                Low Issues
                                            </span>
                                        </div>
                                        <div className="text-3xl font-bold text-emerald-600">
                                            {lowCount}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Code Quality Assessment */}
                            <div>
                                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                    Code Quality Assessment
                                </h3>
                                <div className="">
                                    <p className="leading-relaxed text-lg">
                                        {auditResult.codeQualityAssessment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'vulnerabilities' && (
                        <div className="space-y-6 text-neutral-50">
                            {criticalCount > 0 && (
                                <section>
                                    <h3 className="text-lg font-semibold mb-3 text-red-600 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        Critical Vulnerabilities (
                                        {criticalCount})
                                    </h3>
                                    <div className="space-y-4">
                                        {auditResult.criticalVulnerabilities.map(
                                            (vuln, i) => (
                                                <div key={i} className="">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-semibold text-lg truncate">
                                                                    {vuln.title}
                                                                </h4>
                                                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white/10">
                                                                    {
                                                                        vuln.severity
                                                                    }
                                                                </span>
                                                            </div>

                                                            <p className="text-lg mb-1 leading-relaxed text-neutral-300">
                                                                {
                                                                    vuln.description
                                                                }
                                                            </p>

                                                            {vuln.location && (
                                                                <div className="mb-1">
                                                                    <span className="text-lg font-medium opacity-75">
                                                                        Location:
                                                                    </span>
                                                                    <code className="ml-2 px-2 py-1 bg-white/6 rounded text-lg font-mono">
                                                                        {
                                                                            vuln.location
                                                                        }
                                                                    </code>
                                                                </div>
                                                            )}

                                                            <div className="text-sm mt-1 space-y-1">
                                                                <div>
                                                                    <span className="text-lg font-medium opacity-75">
                                                                        Impact:
                                                                    </span>
                                                                    <p className="mt-1 text-neutral-300">
                                                                        {
                                                                            vuln.impact
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-lg font-medium opacity-75">
                                                                        Recommendation:
                                                                    </span>
                                                                    <p className="mt-1 text-neutral-300">
                                                                        {
                                                                            vuln.recommendation
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </section>
                            )}

                            {mediumCount > 0 && (
                                <section>
                                    <h3 className="text-lg font-semibold mb-3 text-yellow-600 flex items-center gap-2">
                                        Medium Severity Issues ({mediumCount})
                                    </h3>
                                    <div className="space-y-4">
                                        {auditResult.mediumSeverityIssues.map(
                                            (vuln, i) => (
                                                <div key={i} className="">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-semibold text-lg truncate">
                                                                    {vuln.title}
                                                                </h4>
                                                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white/6">
                                                                    {
                                                                        vuln.severity
                                                                    }
                                                                </span>
                                                            </div>
                                                            <p className="text-lg mb-1 leading-relaxed text-neutral-300">
                                                                {
                                                                    vuln.description
                                                                }
                                                            </p>
                                                            {vuln.location && (
                                                                <div className="mb-1">
                                                                    <span className="text-lg font-medium opacity-75">
                                                                        Location:
                                                                    </span>
                                                                    <code className="ml-2 px-2 py-1 bg-white/6 rounded text-lg font-mono">
                                                                        {
                                                                            vuln.location
                                                                        }
                                                                    </code>
                                                                </div>
                                                            )}
                                                            <div className="text-sm mt-1 space-y-1">
                                                                <div>
                                                                    <span className="text-lg font-medium opacity-75">
                                                                        Impact:
                                                                    </span>
                                                                    <p className="mt-1 text-neutral-300">
                                                                        {
                                                                            vuln.impact
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-lg font-medium opacity-75">
                                                                        Recommendation:
                                                                    </span>
                                                                    <p className="mt-1 text-neutral-300">
                                                                        {
                                                                            vuln.recommendation
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </section>
                            )}

                            {lowCount > 0 && (
                                <section>
                                    <h3 className="text-lg font-semibold mb-3 text-yellow-600 flex items-center gap-2">
                                        Low Severity Issues ({lowCount})
                                    </h3>
                                    <div className="space-y-4">
                                        {auditResult.lowSeverityIssues.map(
                                            (vuln, i) => (
                                                <div key={i} className="">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-semibold text-lg truncate">
                                                                    {vuln.title}
                                                                </h4>
                                                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white/6">
                                                                    {
                                                                        vuln.severity
                                                                    }
                                                                </span>
                                                            </div>
                                                            <p className="text-lg mb-1 leading-relaxed text-neutral-300">
                                                                {
                                                                    vuln.description
                                                                }
                                                            </p>
                                                            {vuln.location && (
                                                                <div className="mb-1">
                                                                    <span className="text-lg font-medium opacity-75">
                                                                        Location:
                                                                    </span>
                                                                    <code className="ml-2 px-2 py-1 bg-white/6 rounded text-lg font-mono">
                                                                        {
                                                                            vuln.location
                                                                        }
                                                                    </code>
                                                                </div>
                                                            )}
                                                            <div className="text-lg mt-1 space-y-1">
                                                                <div>
                                                                    <span className="text-lg font-medium opacity-75">
                                                                        Impact:
                                                                    </span>
                                                                    <p className="mt-1 text-neutral-300">
                                                                        {
                                                                            vuln.impact
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-lg font-medium opacity-75">
                                                                        Recommendation:
                                                                    </span>
                                                                    <p className="mt-1 text-neutral-300">
                                                                        {
                                                                            vuln.recommendation
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </section>
                            )}

                            {allVulnerabilities.length === 0 && (
                                <div className="text-center py-12">
                                    <h3 className="text-xl font-semibold text-green-600 mb-2">
                                        No Security Issues Found
                                    </h3>
                                    <p className="text-gray-600">
                                        The contract appears to follow security
                                        best practices.
                                    </p>
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
                                        lineHeight: '1.5',
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
                                        Gas Optimizations
                                    </h3>
                                    <div className="">
                                        <ul className="space-y-2">
                                            {auditResult.gasOptimizations.map(
                                                (optimization, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start gap-2"
                                                    >
                                                        <span className=" mt-1">
                                                            •
                                                        </span>
                                                        <span className="">
                                                            {optimization}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* General Recommendations */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    General Recommendations
                                </h3>
                                <div>
                                    <ul className="space-y-2">
                                        {auditResult.recommendations.map(
                                            (recommendation, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-2"
                                                >
                                                    <span>•</span>
                                                    <span>
                                                        {recommendation}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
          </BlurFade>
           
        </div>
    );
}
