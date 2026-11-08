import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "مُذكَّرتي | منصة مذكرات الإنجليزية للطور المتوسط الجزائري",
  description: "المنصة الرائدة لإعداد وتصدير مذكرات اللغة الإنجليزية لمرحلة التعليم المتوسط وفق المناهج الرسمية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-brand-lavender/30">
        <AuthProvider>
          <div className="flex min-h-screen">
            {/* Sidebar navigation */}
            <Sidebar />

            {/* Main content viewport */}
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
