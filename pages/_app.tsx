import "../styles/globals.scss"
import "bootstrap/dist/css/bootstrap.min.css"
import type { AppProps } from "next/app"
import Layout from "../src/components/Layout"
import SSRProvider from "react-bootstrap/SSRProvider"
import { GlobalProvider } from "../src/context/GlobalContext"
import FullPageLoader from "../src/components/Loader/FullPageLoader"
import { useEffect, useState } from "react"
import { isLoadingService } from "../src/services"
import { AuthProvider } from "../src/context/auth"

export default function App({ Component, pageProps }: AppProps) {
  const [isLoaderLoading, setIsLoaderLoading] = useState(false)

  useEffect(() => {
    const isLoadingServiceSubscription =
      isLoadingService.currentLoadingStatus.subscribe((value: any) => {
        setIsLoaderLoading(value)
      })
    return () => isLoadingServiceSubscription.unsubscribe()
  }, [])

  return (
    <SSRProvider>
      <GlobalProvider>
        {isLoaderLoading && <FullPageLoader />}
        <AuthProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </GlobalProvider>
    </SSRProvider>
  )
}
