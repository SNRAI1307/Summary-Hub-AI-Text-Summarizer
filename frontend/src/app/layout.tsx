import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ["latin"] });

// --- UPDATED METADATA ---
export const metadata: Metadata = {
  title: "Summary Hub",
  description: "Your AI-powered text summarization hub.",
  icons: {
    icon: "/logo.png", // Use logo.png as the favicon
    apple: "/logo.png", // Use for Apple touch icon
  }
};
// -------------------------

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider appearance={{
      elements: {
        formButtonPrimary: 'bg-primary hover:bg-primary-dark',
        card: 'shadow-xl',
        footer: 'hidden'
      }
    }}>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}