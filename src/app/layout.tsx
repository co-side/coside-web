import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { LoginDialogProvider } from "@/contexts/LoginDialogContext";

import "@mdxeditor/editor/style.css";

import "./globals.css";
import theme from "@/styles/theme";
import { Topbar } from "@/components/Topbar";
import QueryClientProvider from "./QueryClientProvider";
import TokenProvider from "@/components/TokenProvider";

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
        <QueryClientProvider>
          <TokenProvider>
            <LoginDialogProvider>
              <AppRouterCacheProvider>
                <ThemeProvider theme={theme}>
                    <Topbar />
                    {children}
                </ThemeProvider>
              </AppRouterCacheProvider>
            </LoginDialogProvider>
          </TokenProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
