interface WalletIconProps {
  className?: string
}

export default function WalletIcon({
  className = 'w-full h-full',
}: WalletIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M21 8.5V7C21 5.34315 19.6569 4 18 4H6C4.34315 4 3 5.34315 3 7V17C3 18.6569 4.34315 20 6 20H18C19.6569 20 21 18.6569 21 17V15.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 8.5H21V15.5H16C14.8954 15.5 14 14.6046 14 13.5V10.5C14 9.39543 14.8954 8.5 16 8.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="17" cy="12" r="1" fill="currentColor" />
      <path
        d="M7 8H11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
