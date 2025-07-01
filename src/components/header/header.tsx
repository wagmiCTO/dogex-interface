import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import Link from 'next/link'
import MobileNavigation from '@/components/header/navigation/mobile-navigation'
import { Navigation } from '@/components/header/navigation/navigation'

export function Header() {
  return (
    <header className="sm:border-b px-4 py-2 md:py-8 2xl:px-20 flex flex-row items-center bg-mainblack z-30 justify-center">
      <div className="w-full max-w-screen-xl flex flex-row justify-between items-center">
        <div className="h-[50px] rounded-lg sm:border justify-start items-center sm:p-2 flex">
          <div className="items-center">
            <div className="hover:brightness-[10]">
              <Link href={'/'}>
                <Image
                  width={25}
                  height={30}
                  src="/logo.jpg"
                  alt="Ooga booga"
                  className="ml-1 hover:text-white cursor-pointer"
                />
              </Link>
            </div>
          </div>
          <div className="h-full border-r ml-4 mr-4  hidden sm:flex"></div>
          <Navigation />
        </div>

        <div className="flex flex-row gap-2 items-center">
          <ConnectButton />
          <MobileNavigation />
        </div>
      </div>
    </header>
  )
}
