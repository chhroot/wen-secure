import Image from 'next/image'
import logo from '@/assets/auditor.svg'

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <Image
            src={logo}
            alt="Smart Contract Auditor Logo"
            width={80}
            height={80}
            className="w-20 h-auto text-white"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Wen Secure ?
            </h1>
            <p className="text-sm text-gray-600">
              AI-powered Ethereum security analysis
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}