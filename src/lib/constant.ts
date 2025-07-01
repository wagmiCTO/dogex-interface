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
