import type { Metadata } from "next";
import "./globals.css";
import { LoadingProvider } from "@/components/LoadingOverlay";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Pennyflow",
  description: "Pennyflow is a modern banking platform for everyone.",
  icons: {
    icon: "./icons/logo.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LoadingProvider>
            {children}
            <Toaster position="bottom-center" richColors />
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}