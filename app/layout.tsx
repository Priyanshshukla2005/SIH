import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AyurSutra - Panchakarma Patient Management Software",
  description:
    "Smart Panchakarma Scheduling & Patient Care - Transform your Ayurveda practice with comprehensive patient management",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const queryClient = new QueryClient()
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} ${poppins.variable} antialiased`}>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={null}>{children}</Suspense>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
