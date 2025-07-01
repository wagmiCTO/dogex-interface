import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavigationLinkProps = {
  address: string
  text: string
  active?: boolean
  classes?: string
}

const NavigationLink = ({
  address,
  active,
  text,
  classes,
}: NavigationLinkProps) => {
  const pathname = usePathname()

  return (
    <Link
      href={address}
      className={
        (classes ? `${classes} ` : '') +
        `${active ? 'text-white' : 'text-gray-400'} px-3 hover:text-white cursor-pointer text-sm`
      }
      onClick={
        pathname === address ? () => window.location.reload() : undefined
      }
    >
      {text}
    </Link>
  )
}

export default NavigationLink
