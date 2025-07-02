import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 p-4 sm:py-6 2xl:px-20 flex flex-row items-center bg-gray-900/95 backdrop-blur-sm z-20 justify-center">
      <div className="w-full max-w-screen-xl flex flex-col sm:flex-row justify-between gap-4">
        <div>
          {/*<div className="flex flex-row gap-6 sm:gap-12 mb-2 flex-wrap items-center">*/}
          {/*  {FOOTER_LINKS.map((link, index) => (*/}
          {/*    <FooterLink key={index} link={link} />*/}
          {/*  ))}*/}

          {/*  <FooterLink*/}
          {/*    link={{*/}
          {/*      text: 'PRIVACY POLICY',*/}
          {/*      subText: '',*/}
          {/*      link: '/privacy-policy',*/}
          {/*    }}*/}
          {/*    visibleXs*/}
          {/*  />*/}
          {/*</div>*/}
        </div>

        <div className="flex flex-col items-center sm:items-end gap-2">
          <div className="hidden sm:flex flex-row gap-2 items-center">
            <p className="audiowide-regular text-[18px] leading-[18px] text-left sm:text-right text-white">
              DogEx
            </p>
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={31}
              height={37}
              className="rounded-sm hover:brightness-125 transition-all duration-200"
            />
          </div>
          <p className="text-[10px] text-gray-400 py-1">
            2024 DogEx. ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
