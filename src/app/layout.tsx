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
          <div className="flex flex-col min-h-screen min-w-[320px] bg-gray-950">
            <Header />
            <div
              className="flex flex-1 justify-center items-center p-4"
              style={{
                background: `linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(31, 41, 55, 0.6) 100%), url('/pattern.png') repeat`,
              }}
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
