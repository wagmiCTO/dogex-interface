'use client'

import { usePathname } from 'next/navigation'
import { HEADER_NAVIGATION_LINKS } from '@/components/header/navigation/constant'
import NavigationLink from '@/components/header/navigation-link'

export function Navigation() {
  const path = usePathname()

  return (
    <div className="hidden sm:flex flex-row gap-4">
      {HEADER_NAVIGATION_LINKS.map((link, i) => (
        <NavigationLink
          key={i}
          address={link.address}
          active={
            path === link.address ||
            path.includes(
              link.address.slice(1).length > 0
                ? link.address.slice(1)
                : 'undefined',
            )
          }
          text={link.label}
        />
      ))}
    </div>
  )
}
