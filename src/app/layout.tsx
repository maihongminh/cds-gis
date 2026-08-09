import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { ApiProvider } from "@/lib/ApiProvider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { TooltipProvider } from "@/components/ui";

import { APP_CONFIG } from "@/lib/app-config";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://laobao.windify.workers.dev/'),
  title: APP_CONFIG.fullName,
  description: APP_CONFIG.description,
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: APP_CONFIG.fullName,
    description: APP_CONFIG.description,
    url: "https://laobao.windify.workers.dev/",
    siteName: APP_CONFIG.fullName,
    images: [
      {
        url: "/ogp.png",
        width: 1200,
        height: 630,
        alt: "Agri Management Lao Bảo Open Graph Image",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${beVietnamPro.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <ApiProvider>
              {children}
            </ApiProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
