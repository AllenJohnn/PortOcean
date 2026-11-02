import DepthSounder from "@/components/abyss/DepthSounder";
import IntroLoader from "@/components/abyss/IntroLoader";
import CustomCursor from "@/components/abyss/CustomCursor";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import Scene from "@/components/abyss/Scene";
import Hud from "@/components/abyss/Hud";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";

const clashDisplay = localFont({
  src: "../../public/fonts/ClashDisplay-Semibold.ttf",
  variable: "--font-clash",
  display: "swap",
  weight: "600",
});

const cabinetGrotesk = localFont({
  src: "../../public/fonts/CabinetGrotesk-Medium.ttf",
  variable: "--font-cabinet",
  display: "swap",
  weight: "500",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#02080e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta
          name="google-site-verification"
          content="WGE3Gq7dDhYzGKUnBdAlULZYAww2nW4IvOuExE5c_14"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-[#02080e] text-[#e8fbff] font-sans antialiased relative selection:bg-[#5ff2e0]/20 selection:text-[#5ff2e0]",
          clashDisplay.variable,
          cabinetGrotesk.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
          <SmoothScrollProvider>
            <TooltipProvider delayDuration={0}>
              <Scene />
              <Hud />
              <div className="relative z-10 w-full min-h-screen">
                {children}
              </div>
              <DepthSounder />
              <IntroLoader />
              <CustomCursor />
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
