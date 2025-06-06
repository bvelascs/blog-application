import "@repo/ui/styles.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Full stack Blog Admin",
  description: "Administration of Full Stack Blog",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  const serverCookies = await cookies();
  const theme = serverCookies.get("theme")?.value || "light";
  const isDark = theme === "dark";
  
  return (
    <html lang="en" data-theme={theme} className={isDark ? "dark" : ""}>
      <head>
        {/* Script to prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Try to get theme from cookie
              const themeCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('theme='))
                ?.split('=')[1];
                
              // If cookie exists, use it
              if (themeCookie === 'dark' || themeCookie === 'light') {
                document.documentElement.setAttribute('data-theme', themeCookie);
                if (themeCookie === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              }
            })();
          `
        }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
