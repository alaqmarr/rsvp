import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
export const metadata: Metadata = {
  title: "RSVP powered by alaqmar.dev",
  description: "Take RSVP's for your events with ease",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: "500",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn("bg-gradient-to-r from-blue-200 to-cyan-200", poppins.className)}>
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
