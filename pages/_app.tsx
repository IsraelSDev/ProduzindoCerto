import '../styles/globals.css'
import 'mapbox-gl/dist/mapbox-gl.css';

import type { AppProps } from 'next/app'
import Head from 'next/head';
import Script from 'next/script';

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <Script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js" />
      <Script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js" />
    </Head>
    <Component {...pageProps} />
  </>
}
