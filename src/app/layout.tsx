
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// @ts-ignore: CSS imports may require additional type declarations
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartHire - Plateforme de Gestion des Candidatures",
  description: "Système de suivi des candidatures",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>

        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "14px",
              background: "#ffffff",
              color: "#111827",
              padding: "14px 18px",
              boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
              fontWeight: 500,
            },
            success: {
              iconTheme: {
                primary: "#16a34a",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#dc2626",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </body>
    </html>
  );
} 