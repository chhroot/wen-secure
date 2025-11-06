'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ContractAddressInput } from '@/components/contract-address-input';
import { ProgressIndicator } from '@/components/progress-indicator';
import Image from 'next/image';
import seperator from '@/assets/seperator.svg';
import { TypingAnimation } from './ui/typing-animation';

export function AuditHeader() {
    const topLeftRef = useRef<HTMLDivElement>(null);
    const topRightRef = useRef<HTMLDivElement>(null);
    const bottomLeftRef = useRef<HTMLDivElement>(null);
    const bottomRightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();

        gsap.set([topLeftRef.current, topRightRef.current], {
            width: 0,
            height: 0,
        });
        gsap.set([bottomLeftRef.current, bottomRightRef.current], {
            width: 0,
            height: 0,
        });

        tl.to([
            topLeftRef.current,
            topRightRef.current,
            bottomLeftRef.current,
            bottomRightRef.current
        ], {
            width: 32,
            height: 32,
            duration: 0.9,
            ease: "power2.out",
            delay: 1.5,
        });

    }, []);

    return (
        <div className="text-center flex flex-col gap-5 w-full justify-center">
            <div className="relative p-8 mx-auto max-w-fit">
                <div className="absolute inset-0 pointer-events-none">
                    <div 
                        ref={topLeftRef}
                        className="absolute top-0 left-0 border-t-2 border-l-2 border-neutral-200"
                    ></div>
                    <div 
                        ref={topRightRef}
                        className="absolute top-0 right-0 border-t-2 border-r-2 border-neutral-200"
                    ></div>
                    <div 
                        ref={bottomLeftRef}
                        className="absolute bottom-0 left-0 border-b-2 border-l-2 border-neutral-200"
                    ></div>
                    <div 
                        ref={bottomRightRef}
                        className="absolute bottom-0 right-0 border-b-2 border-r-2 border-neutral-200"
                    ></div>
                </div>
                <TypingAnimation cursorStyle='block' typeSpeed={50} className="font-mono text-4xl md:text-6xl text-neutral-50">
                    AUDIT A SMART CONTRACT
                </TypingAnimation>
            </div>
            <p className="text-2xl font-grotesk text-neutral-500 text-center max-w-2xl mx-auto">
                Simple Smart Contract Audit: <br />
                Detect Critical Bugs and Vulnerabilities
            </p>

            <Image
                src={seperator}
                alt="Separator"
                className="w-2xl h-auto mx-auto"
            />

            <div className="space-y-4 w-full">
                <ContractAddressInput />
                <ProgressIndicator />
            </div>
        </div>
    );
}