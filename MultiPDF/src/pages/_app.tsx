import type { AppProps } from 'next/app'
import { publishTauriEvents } from '../hooks/useTauriEvents'

import '../style.css'
import '../App.css'

publishTauriEvents(['my-event', 'click-event'])

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
