'use client'

import { useEffect, useState } from 'react'

export function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    updateMobile()
    window.addEventListener('resize', updateMobile)
    return () => window.removeEventListener('resize', updateMobile)
  }, [breakpoint])

  return isMobile
}
