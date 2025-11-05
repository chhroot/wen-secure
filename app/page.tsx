import { ContractAddressInput } from '@/components/contract-address-input';
import { AuditButton } from '@/components/audit-button';
import { ProgressIndicator } from '@/components/progress-indicator';
import { AuditResults } from '@/components/audit-results';
import { HyperText } from '@/components/ui/hyper-text';

export default function Home() {
    return (
        <div className="bg-linear-to-br from-blue-50 via-white to-purple-50">
            <main className="max-w-7xl min-h-[80vh] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-center items-center">
                <div className="text-center flex flex-col gap-1 w-full">
                    <div className="text-5xl font-bold text-gray-900 flex flex-col md:flex-row justify-center gap-0 md:gap-2">
                        <HyperText>FIND</HyperText>
                        <span> </span>
                        <HyperText className="text-yellow-300">
                            VULNERABILITIES
                        </HyperText>
                        <span> </span>
                        <HyperText>BEFORE HACKERS DO</HyperText>
                    </div>
                    <p className="text-base text-gray-600 mb-8 max-w-3xl mx-auto">
                        Get AI-powered security analysis for Ethereum smart
                        contracts. Simply enter a contract address to identify
                        vulnerabilities, gas optimizations, and best practices.
                    </p>
                </div>

                <div className="space-y-8 w-full">
                    <div className="space-y-6">
                        <ContractAddressInput />
                        <AuditButton />
                    </div>

                    <ProgressIndicator />
                    <AuditResults />
                </div>
            </main>
        </div>
    );
}
