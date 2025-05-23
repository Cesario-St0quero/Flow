import Nav from "@/components/Nav/Nav";
import Providers from "@/lib/utils/Providers/Provider.client";
import { AppRoutes } from "@/lib/utils/constants/AppRoutes";
import NextSvg from "@/public/next.svg";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]/route";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Next Flow",
  description: "Daniel e Cesario",
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-primary text-black min-h-screen font-medium`}
      >
        <header className="flex justify-between items-center p-4">
          <h1 className="text-2xl text-center uppercase text-black font-semibold">
            <Link href={AppRoutes.Home}>
              <Image src={NextSvg} width={80} alt="Next" />
              flow
            </Link>
          </h1>
          <Nav session={session} />
        </header>

        <main className="flex h-[75vh] flex-col items-center px-4 overflow-auto">
          <Providers>{children}</Providers>
        </main>

        <footer
          className="w-full  p-2 border-t
        absolute bottom-0"
        >
          <div className="flex flex-col items-center"></div>
        </footer>
      </body>
    </html>
  );
}
