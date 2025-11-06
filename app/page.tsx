'use client';

import { ContractAddressInput } from '@/components/contract-address-input';
import { ProgressIndicator } from '@/components/progress-indicator';
import { AuditResults } from '@/components/audit-results';
import { useAuditStore } from '@/lib/store/audit-store';
import Image from 'next/image';
import seperator from '@/assets/seperator.svg';
import backgroundPattern from '@/assets/background-pattern.webp';

export default function Home() {
    const { auditResult, auditProgress } = useAuditStore();
    const hasResults = auditResult || auditProgress.step === 'complete';

    return (
        <div>
            <main>
                {/* Hero section with background image */}
                <section
                    className={`w-full mx-auto bg-cover bg-no-repeat bg-top px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center gap-10 transition-all duration-500 ${
                        hasResults ? 'min-h-fit py-12' : 'min-h-screen justify-center'
                    }`}
                    style={{ backgroundImage: `url(${backgroundPattern.src})` }}
                >
                    <div className="text-center flex flex-col gap-3 w-full">
                        <div className="relative p-8 mx-auto max-w-fit">
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neutral-200"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neutral-200"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neutral-200"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neutral-200"></div>
                            </div>
                            <div className="font-mono text-4xl md:text-6xl text-neutral-50">
                                AUDIT A SMART CONTRACT
                            </div>
                        </div>
                        <p className="text-2xl font-grotesk text-neutral-500 text-center max-w-2xl mx-auto">
                            Simple Smart Contract Audit: <br />
                            Detect Critical Bugs and Vulnerabilities
                        </p>
                    </div>

                    <Image
                        src={seperator}
                        alt="Separator"
                        className="w-2xl h-auto"
                    />

                    <div className="space-y-4 w-full">
                        <ContractAddressInput />
                        <ProgressIndicator />
                    </div>
                </section>

                {/* Audit results section without background */}
                {hasResults && (
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <AuditResults />
                    </section>
                )}
            </main>
        </div>
    );
}
