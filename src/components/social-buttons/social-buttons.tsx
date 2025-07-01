import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SOCIAL_MEDIA_LINKS } from '@/lib/constant'

type SocialButtonsProps = {
  size?: number
  containerClasses?: string
}

const SocialButtons = ({ size, containerClasses }: SocialButtonsProps) => {
  return (
    <div
      className={`flex flex-row items-center justify-center gap-3 ${containerClasses}`}
    >
      {(
        Object.keys(SOCIAL_MEDIA_LINKS) as Array<
          keyof typeof SOCIAL_MEDIA_LINKS
        >
      ).map((media) => (
        <Link
          href={SOCIAL_MEDIA_LINKS[media]}
          key={media}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="sm"
            variant="ghost"
            className={
              size
                ? `w-[${size}px] min-w-[${size}px] h-[${size}px] leading-[${size}px] p-0 rounded-[${size}px]`
                : ''
            }
          >
            <Image
              width={size ? size - 6 : 24}
              height={size ? size - 6 : 24}
              src={`/icons/socials/${media}.svg`}
              alt="Funny bear"
            />
          </Button>
        </Link>
      ))}
    </div>
  )
}

export default SocialButtons
