import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import Link from 'next/link'
import MobileNavigation from '@/components/header/navigation/mobile-navigation'
import { Navigation } from '@/components/header/navigation/navigation'

export function Header() {
  return (
    <header className="border-b border-gray-800 px-4 py-4 md:py-6 2xl:px-20 flex flex-row items-center bg-gray-900/95 backdrop-blur-sm z-30 justify-center sticky top-0">
      <div className="w-full max-w-screen-xl flex flex-row justify-between items-center">
        <div className="h-[50px] rounded-lg justify-start items-center sm:p-2 flex">
          <div className="items-center">
            <div className="hover:brightness-125 transition-all duration-200">
              <Link href={'/'}>
                <Image
                  width={25}
                  height={30}
                  src="/logo.jpg"
                  alt="Ooga booga"
                  className="ml-1 hover:text-white cursor-pointer rounded-sm"
                />
              </Link>
            </div>
          </div>
          <div className="h-full ml-4 mr-4 hidden sm:flex"></div>
          <Navigation />
        </div>

        <div className="flex flex-row gap-3 items-center">
          <div className="[&_button]:bg-gray-800 [&_button]:border-gray-700 [&_button]:text-white [&_button]:hover:bg-gray-700 [&_button]:transition-colors [&_button]:duration-200">
            <ConnectButton />
          </div>
          <MobileNavigation />
        </div>
      </div>
    </header>
  )
}
