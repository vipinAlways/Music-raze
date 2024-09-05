  import type { Metadata } from "next";
  import { Inter } from "next/font/google";
  import "./globals.css";
  import Provider from "@/components/Provider";
  import Appbar from "@/components/Appbar";
  import { Toaster } from "@/components/ui/toaster"

  const inter = Inter({ subsets: ["latin"] });

  export const metadata: Metadata = {
    title: "Music Raze",
    description: "Group Music selector",
  };

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <body className={`${inter.className} bg-[#FBF2EA]`}>
          <Provider>
            <div className="px-10 py-3">
            <Appbar/>
              {children}</div>
              <Toaster/>
          </Provider>

        </body>
      </html>
    );
  }
