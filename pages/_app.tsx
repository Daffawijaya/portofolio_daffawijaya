import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Tomorrow } from '@next/font/google'

const tomorrow =  Tomorrow({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '800', '900'],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={tomorrow.className}>
      <Component {...pageProps} />
    </main>
  )
}
