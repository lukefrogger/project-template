import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/hooks/react-query-provider";
export const dynamic = "force-dynamic";
import localFont from "next/font/local";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.clarify.design"),
  title: "Project Starter",
  description: "Project starter for clarify web design.",
  keywords: [],
  openGraph: {
    title: "Project Starter",
    description: "Project starter for clarify web design.",
    images: [
      {
        url: `/images/project-starter-og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Project Starter",
      },
    ],
    type: "website",
    siteName: "Project Starter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Starter",
    description: "Project starter for clarify web design.",
    images: [`/images/project-starter-og-image.jpg`],
  },
  robots: {
    index: false,
    follow: false,
  },
};

const myFont = localFont({
  src: "../public/fonts/variable_font_here.ttf",
  display: "swap",
});

const isProduction = process.env.ENV_MODE === "production";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={myFont.className}>
      <body>
        {!isProduction && (
          <div className="fixed top-0 left-0 w-full bg-error-700/75 text-white z-50 text-sm text-center py-1 text-bold">
            This is a {process.env.ENV_MODE || "testing"} environment.
          </div>
        )}
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
