import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ContentSpark - Turn One Blog Post Into 5 Social Media Posts",
  description:
    "AI-powered content repurposing. Paste your article and instantly get optimized posts for Twitter/X, LinkedIn, Instagram, Email, and Reddit. Try 2 for free.",
  keywords: [
    "content repurposing",
    "AI content generator",
    "social media content",
    "blog to social media",
    "content creator tools",
  ],
  openGraph: {
    title: "ContentSpark - Turn One Blog Post Into 5 Social Media Posts",
    description:
      "AI-powered content repurposing. Paste your article and instantly get optimized posts for Twitter/X, LinkedIn, Instagram, Email, and Reddit.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ContentSpark - Turn One Blog Post Into 5 Social Media Posts",
    description:
      "AI-powered content repurposing. Paste your article and instantly get optimized posts for 5 platforms.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
