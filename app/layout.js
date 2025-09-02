import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export const metadata = {
  title: 'Wrestling Haiku Generator | WCJ',
  description: 'Transform your hottest wrestling takes into poetic art. 17 syllables of squared circle truth.',
  keywords: 'wrestling, haiku, poetry, WWE, AEW, wrestling memes, wrestling twitter',
  authors: [{ name: 'Wrestling Circle Jerks' }],
  creator: 'Fladry Creative',
  publisher: 'Wrestling Circle Jerks',
  openGraph: {
    title: 'Wrestling Haiku Generator',
    description: 'Transform your hottest wrestling takes into poetic art',
    url: 'https://wrestlinghaiku.com',
    siteName: 'Wrestling Haiku',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Wrestling Haiku Generator - Turn wrestling takes into poetry',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wrestling Haiku Generator | WCJ',
    description: 'Transform your hottest wrestling takes into poetic art',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>{children}</body>
    </html>
  )
}