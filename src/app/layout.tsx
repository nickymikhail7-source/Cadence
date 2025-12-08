import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Cadence — Never miss a beat",
  description: "AI-powered External Relationship Intelligence platform for B2B teams",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
