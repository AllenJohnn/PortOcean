import Navbar from "@/components/navbar";
import PageTransition from "@/components/page-transition";
import ScrollProgress from "@/components/scroll-progress";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
});

const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-G7LNSPX49D";

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: "Allen John Joy | Web Developer & MCA Student",
    template: `%s | Allen John Joy`,
  },
  description: DATA.description,
  openGraph: {
    title: "Allen John Joy | Web Developer & MCA Student",
    description: DATA.description,
    url: DATA.url,
    siteName: `${DATA.name}`,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Allen John Joy | Web Developer & MCA Student",
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta
          name="google-site-verification"
          content="WGE3Gq7dDhYzGKUnBdAlULZYAww2nW4IvOuExE5c_14"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased relative",
          geist.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SmoothScrollProvider>
            <TooltipProvider delayDuration={0}>
              <ScrollProgress />
              <div className="hidden sm:absolute inset-0 top-0 left-0 right-0 h-[100px] overflow-hidden z-0">
                <FlickeringGrid
                  className="h-full w-full"
                  squareSize={2}
                  gridGap={2}
                  style={{
                    maskImage: "linear-gradient(to bottom, black, transparent)",
                    WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
                  }}
                />
              </div>
              <PageTransition>
                <div className="relative z-10 max-w-2xl mx-auto py-12 pb-24 sm:py-24 px-6">
                  {children}
                </div>
              </PageTransition>
              <Navbar />
            </TooltipProvider>
          </SmoothScrollProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
