import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CareerPath AI",
  description:
    "Personalized career guidance, skill-gap analysis, mock interviews, and opportunity matching for students — powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <footer className="bg-white border-t border-slate-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-slate-500">
                © 2025 CareerPath AI.
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <span>Aligned with NEP 2020 • Skill India • Digital India • Viksit Bharat 2047</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
