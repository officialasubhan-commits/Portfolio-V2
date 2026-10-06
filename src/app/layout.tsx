import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Arjun Mehta — AI/ML Engineer & Software Architect",
  description:
    "Portfolio of Arjun Mehta — crafting intelligent systems, scalable architectures, and exceptional digital experiences at the intersection of AI and software engineering.",
  keywords: [
    "AI Engineer",
    "Machine Learning",
    "Software Architect",
    "Full Stack Developer",
    "Portfolio",
  ],
  openGraph: {
    title: "Arjun Mehta — AI/ML Engineer & Software Architect",
    description:
      "Crafting intelligent systems and exceptional digital experiences.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
