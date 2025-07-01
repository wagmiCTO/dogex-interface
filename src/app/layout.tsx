import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/footer/footer'
import { Header } from '@/components/header/header'
import { Providers } from '@/components/providers/providers'

export const metadata: Metadata = {
  title: 'DogEx - the easiest way to trade',
  description: 'Trade with high leverage and low fees',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen min-w-[320px] bg-[#151515]">
            <Header />
            <div
              className="flex flex-1 justify-center items-center"
              style={{ background: `url('/pattern.png') repeat black` }}
            >
              {children}
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
