/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { HEADER_NAVIGATION_LINKS } from './constant'

const MobileNavigation = () => {
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [showMenu])

  return (
    <div className="flex sm:hidden">
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-gray-800 px-2 focus-visible:ring-offset-0 transition-colors duration-200"
        onClick={() => setShowMenu(!showMenu)}
      >
        {showMenu ? (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </Button>

      {/* Mobile Menu Overlay */}
      <div
        className={`${
          showMenu ? 'opacity-100 visible' : 'opacity-0 invisible'
        } fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 top-[82px]`}
        onClick={() => setShowMenu(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`${
          showMenu ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } fixed top-[82px] right-0 h-[calc(100vh-82px)] w-80 max-w-[90vw] bg-gray-900/95 backdrop-blur-lg border-l border-gray-800 z-50 transition-all duration-300 ease-in-out flex flex-col pointer-events-${
          showMenu ? 'auto' : 'none'
        }`}
      >
        {/* Navigation Links */}
        <div className="flex flex-col p-6 space-y-4">
          <div className="text-sm text-gray-400 font-medium uppercase tracking-wide mb-2">
            Navigation
          </div>

          {HEADER_NAVIGATION_LINKS.map((link, i) => (
            <Link
              key={i}
              href={link.address}
              onClick={() => setShowMenu(false)}
              className="flex items-center py-3 px-4 rounded-lg text-white hover:bg-gray-800/50 transition-colors duration-200 group"
            >
              <span className="font-medium">{link.label}</span>
              <svg
                className="w-4 h-4 ml-auto text-gray-500 group-hover:text-gray-300 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-gray-800"></div>

        {/* Connect Button Section */}
        <div className="p-6 mt-auto">
          <div className="text-sm text-gray-400 font-medium uppercase tracking-wide mb-4">
            Wallet
          </div>
          <div className="[&_button]:w-full [&_button]:bg-[rgba(61,213,152,1)] [&_button]:border-[rgba(61,213,152,1)] [&_button]:text-white [&_button]:hover:bg-[rgba(61,213,152,0.8)] [&_button]:hover:border-[rgba(61,213,152,0.8)] [&_button]:transition-all [&_button]:duration-200 [&_button]:font-medium [&_button]:shadow-lg [&_button]:hover:shadow-[rgba(61,213,152,0.25)] [&_button]:justify-center">
            <ConnectButton />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800">
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/logo.jpg"
              alt="DogEx"
              width={20}
              height={24}
              className="rounded-sm"
            />
            <span className="text-sm text-gray-400">DogEx</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNavigation
