export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm bottom-0 h-fit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-semibold text-gray-900">
              Wen Secure ?
            </span>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span>Paste Contract Address</span>
            <span>•</span>
            <span>Run AI Audit</span>
            <span>•</span>
            <span>Get Detailed Report</span>
          </div>
        </div>
      </div>
    </footer>
  )
}