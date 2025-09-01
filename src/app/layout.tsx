// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ⬇️ Krepšelio kontekstas ir stalčius
import { CartProvider } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "professional-next",
    description: "Demo katalogas su krepšeliu",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="lt">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ⬇️ Viskas, kas susiję su krepšeliu */}
        <CartProvider>
            {children}
            <CartDrawer />
        </CartProvider>
        </body>
        </html>
    );
}
