import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 p-4 sm:py-6 2xl:px-20 flex flex-row items-center bg-gray-900/95 backdrop-blur-sm z-20 justify-center">
      <div className="w-full max-w-screen-xl flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-6">
          <a
            href="https://dogex-3.gitbook.io/dogex-docs/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
            aria-label="DogEx Documentation"
          >
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-400 group-hover:text-white transition-colors duration-200"
            >
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="14,2 14,8 20,8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="16"
                y1="13"
                x2="8"
                y2="13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="16"
                y1="17"
                x2="8"
                y2="17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="10,9 9,9 8,9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Docs</span>
          </a>
          <a
            href="https://x.com/dogexperps"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
            aria-label="Follow DogEx on X (Twitter)"
          >
            <Image
              src="/icons/x-twitter.svg"
              alt="X (Twitter)"
              width={14}
              height={14}
              className="transition-colors duration-200"
              style={{ filter: 'brightness(0) saturate(100%) invert(60%)' }}
            />
            <span>Twitter</span>
          </a>
        </div>

        <div className="flex justify-center items-center">
          <span className="text-gray-400 text-xs">
            Charts by{' '}
            <a
              href="https://www.tradingview.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200 underline"
            >
              TradingView
            </a>
          </span>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-2">
          <div className="hidden sm:flex flex-row gap-4 items-center">
            <div className="flex flex-row gap-2 items-center">
              <p className="audiowide-regular text-[18px] leading-[18px] text-left sm:text-right text-white">
                DogEx
              </p>
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={31}
                height={37}
                className="rounded-sm hover:brightness-125 transition-all duration-200"
              />
            </div>
          </div>

          {/* Mobile version */}
          <div className="flex sm:hidden flex-row gap-4 items-center">
            <div className="flex flex-row gap-2 items-center">
              <p className="audiowide-regular text-[18px] leading-[18px] text-white">
                DogEx
              </p>
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={31}
                height={37}
                className="rounded-sm hover:brightness-125 transition-all duration-200"
              />
            </div>
          </div>

          <p className="text-[10px] text-gray-400 py-1">
            2024 DogEx. ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
