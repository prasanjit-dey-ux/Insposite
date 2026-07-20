import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono, Instrument_Serif, Sacramento} from "next/font/google";
import "./globals.css";
import Navbar from "@/component/layout/navbar";
import Footer from "@/component/layout/footer";
import { Analytics } from "@vercel/analytics/react";
import { SubmitModalProvider } from "@/component/ui/submitModal";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
})

const sacramento = Sacramento({
  variable: "--font-signature",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://insposite.vercel.app"),
  title: "Insposite",
  description:
    "Discover developer portfolios, inspiration websites, and useful web tools — curated for people who build for the web.",
  openGraph: {
    title: "Insposite",
    description:
      "Portfolios, inspiration sites, and useful web tools in one curated hub.",
    url: "https://insposite.vercel.app",
    siteName: "INSPOSITE",
    images: [
      {
        url: "/og1.png",
        width: 1200,
        height: 630,
        alt: "INSPOSITE - curated inspiration for creative minds",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Insposite",
    description:
      "Portfolios, inspiration websites, and useful web tools for people who build for the web.",
    images: ["/og1.png"],
    
  },
  icons: {
    icon: "/logo.svg",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetBrainsMono.variable} ${instrumentSerif.variable} ${sacramento.variable} ${plusJakartaSans.variable} antialiased`}>
      <body
        className="font-sans antialiased bg-white text-neutral-900"
      >
        <SubmitModalProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SubmitModalProvider>

        <Analytics />
      </body>
    </html>
  );
}
