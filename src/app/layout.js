import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DevSolve — Ask & Answer Anything",
  description: "A modern full-stack Q&A platform built with Next.js and Appwrite. Ask questions, share knowledge, vote, and connect with the community.",
  keywords: "askit, qna, appwrite, next.js, fullstack, tailwind, react, markdown, voting system",
  authors: [{ name: "Mohammed Raiyaan" }],
  creator: "Mohammed Raiyaan",
  openGraph: {
    title: "DevSolve — Ask & Answer Anything", // replace with your actual deployed link
    siteName: "DevSolve",
    type: "website",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#0f172a",
                color: "#fff",
                borderRadius: "8px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
