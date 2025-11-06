'use client';

import { AuditResults } from '@/components/audit-results';
import { AuditHeader } from '@/components/audit-header';
import { useAuditStore } from '@/lib/store/audit-store';
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
                    <AuditHeader />
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
