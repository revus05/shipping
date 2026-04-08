import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { getSession, toAuthUser } from "@/lib/auth/session"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()
  const user = session ? toAuthUser(session) : null

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("dark antialiased", fontMono.variable, inter.variable)}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <AuthProvider user={user}>{children}</AuthProvider>
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
