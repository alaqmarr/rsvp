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

export const metadata: Metadata = {
  title: "RSVP powered by alaqmar.dev",
  description: "Take RSVP's for your events with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gradient-to-r from-blue-200 to-cyan-200">
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
