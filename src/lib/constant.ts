import type { FootLink, SocialMedia } from '@/lib/types'

export const FOOTER_LINKS: FootLink[] = [
  { text: 'TERMS OF USE', subText: 'LEGAL TERMS', link: '/terms-of-use' },
  {
    text: 'DOCS',
    subText: 'LEARN MORE',
    link: 'https://docs.oogabooga.io/',
  },
]

export const SOCIAL_MEDIA_LINKS: Record<SocialMedia, string> = {
  twitter: 'https://twitter.com/0xoogabooga',
  discord: 'https://discord.com/invite/0xoogabooga',
}

export const USDC = {
  address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  decimal: 6,
}

export const LINK = {
  address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
  decimal: 18,
}

export const ALLOWED_SLIPPAGE = 0.1
