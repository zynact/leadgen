import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import {ThemeProvider} from "@/components/theme-provider";

import './globals.css'
import {Toaster} from "react-hot-toast";

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LeadGen',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
      <Toaster
          position="top-right"
          toastOptions={{
              duration: 3200,
              style: {
                  background: "rgba(21, 34, 56, 0.85)",
                  color: "#E5EDF7",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow:
                      "0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
                  padding: "14px 18px",
                  fontSize: "14px",
                  fontWeight: 500,
              },

              success: {
                  iconTheme: {
                      primary: "#22C55E",
                      secondary: "#0B172A",
                  },
              },

              error: {
                  iconTheme: {
                      primary: "#EF4444",
                      secondary: "#0B172A",
                  },
              },
          }}

      />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

      </body>
    </html>
  )
}
