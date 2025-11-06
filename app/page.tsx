import { ContractAddressInput } from '@/components/contract-address-input';
import { ProgressIndicator } from '@/components/progress-indicator';
import { AuditResults } from '@/components/audit-results';
import Image from 'next/image';
import seperator from '@/assets/seperator.svg';
import backgroundPattern from '@/assets/background-pattern.png';

export default function Home() {
    return (
        <div
            className="bg-black bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${backgroundPattern.src})` }}
        >
            
            <main className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center gap-10">
                <div className="text-center flex flex-col gap-3 w-full mt-32">
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

                <section className="space-y-24 w-full">
                    <div className="space-y-4">
                        <ContractAddressInput />
                        <ProgressIndicator />
                    </div>
                    <AuditResults />
                </section>
            </main>
        </div>
    );
}
