import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import "@/app/globals.css";
export default function TemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
        className="bg-gradient-to-r from-blue-200 to-cyan-200"
        >
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
