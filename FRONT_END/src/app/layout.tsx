import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MiniAppReady from "../app/components/MiniAppReady";

const inter = Inter({ subsets: ["latin"] });

import { headers } from "next/headers";
import ContextProvider from "@/app/context";


export const metadata: Metadata = {
  title: "Novana",
  description: "You are not alone in this one",
  icons: {
    icon: "/logo.png",
  },
  other: {
    // 👇 This adds the Farcaster Mini App meta tag automatically
    "fc:miniapp": JSON.stringify({
      name: "Novana",
      action_url: "https://novanaxyz.vercel.app/",
      icon: "https://novanaxyz.vercel.app/logo.png",
      splash: {
        image: "https://novanaxyz.vercel.app/splash.png",
        background_color: "#ffffff",
      },
    }),
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en">
      <body className={inter.className}>
        <MiniAppReady />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <ContextProvider cookies={cookies}>

          {children}

        </ContextProvider>
      </body>
    </html>
  );
}
