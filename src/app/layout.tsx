import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

import "./globals.css";
import theme from "@/styles/theme";
import { Topbar } from "@/components/Topbar";
import QueryClientProvider from "./QueryClientProvider";
import TokenProvider from "@/app/AuthServerProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Co-Side",
  description: "Find your best parter for your next project",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ position: "relative" }}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <QueryClientProvider>
              <TokenProvider>
                <Topbar />
                {children}
              </TokenProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
  </body>
    </html>
  );
}
