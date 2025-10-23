import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/index.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QueryProvider } from "@/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Support Copilot",
  description: "AI-powered customer support management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
