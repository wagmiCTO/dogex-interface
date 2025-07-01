'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { FootLink } from '@/lib/types'

type FooterLinkProps = { link: FootLink; visibleXs?: boolean }

const FooterLink = ({ link, visibleXs }: FooterLinkProps) => {
  return (
    <div
      key={link.text}
      className={`${visibleXs ? 'sm:hidden' : ''} flex flex-col gap-1 sm:gap-2`}
    >
      <Tooltip>
        <TooltipTrigger>
          <Link
            href={link.link}
            className="flex flex-row gap-2"
            target="_blank"
            onClick={(e) => (link.link === '#' ? e.preventDefault() : null)}
          >
            <p className="text-white sm:text-mainblack-foreground text-[13px] hover:text-white">
              {link.text}
            </p>
            <Image
              src="/icons/link-arrow.svg"
              alt={link.text}
              width={20}
              height={20}
              style={{ color: 'wheat' }}
            />
          </Link>
        </TooltipTrigger>
        {link.link === '#' && (
          <TooltipContent>
            <p>Coming soon</p>
          </TooltipContent>
        )}
      </Tooltip>

      <p className="text-mainblack-foreground text-[10px] opacity-50">
        {link.subText}
      </p>
    </div>
  )
}

export default FooterLink
