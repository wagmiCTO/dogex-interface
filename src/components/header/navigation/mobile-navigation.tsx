'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { HEADER_NAVIGATION_LINKS } from '@/components/header/navigation/constant'
import SocialButtons from '@/components/social-buttons/social-buttons'
import { Button } from '@/components/ui/button'

const MobileNavigation = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false)

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
        className="text-white px-2 focus-visible:ring-offset-0"
        onClick={() => setShowMenu(!showMenu)}
      >
        {showMenu ? (
          <Image src="/icons/close.svg" alt="Manu" width={20} height={20} />
        ) : (
          <Image src="/icons/menu.svg" alt="Manu" width={20} height={20} />
        )}
      </Button>

      <div
        className={`${showMenu ? 'flex' : 'hidden'} p-[25px] flex-col justify-between bg-mainblack min-h-[calc(100vh-66px)] w-full absolute top-[66px] left-0 border-t`}
      >
        <div className="flex flex-col gap-2">
          {HEADER_NAVIGATION_LINKS.map((link, i) => (
            <Link
              key={i}
              href={link.address}
              onClick={() => setShowMenu(false)}
            >
              <Button className="w-full">{link.label}</Button>
            </Link>
          ))}
        </div>
        <div className="flex flex-row justify-center">
          <SocialButtons />
        </div>
      </div>
    </div>
  )
}

export default MobileNavigation
