import '@fontsource/inter/index.css'
import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'MarketQuest - Fictional Stock Market Game',
  description: 'A gamified fictional stock market simulator. Not real financial advice.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  )
}
