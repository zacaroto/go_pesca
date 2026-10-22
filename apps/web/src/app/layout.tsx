import type { Metadata } from "next";
import { Inter, Libre_Caslon_Display, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caslon = Libre_Caslon_Text({
  variable: "--font-caslon",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const caslonDisplay = Libre_Caslon_Display({
  variable: "--font-caslon-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Go Pesca",
  description: "Tu Pescadex de Pesca",
  // apple-icon.png and favicon.ico in this folder are picked up by convention.
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${inter.variable} ${caslon.variable} ${caslonDisplay.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ground text-text">
        {children}
      </body>
    </html>
  );
}
