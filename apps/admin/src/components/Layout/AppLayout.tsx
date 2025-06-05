import { type PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";
import { ThemeContextProvider } from "../Themes/ThemeContext";
import AdminMenu from "./AdminMenu";

export async function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {
  return (
    <ThemeContextProvider>      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
        <AdminMenu />
        <div className="flex flex-1">
          <LeftMenu />
          <main className="flex-1 p-6">
            <div className="container mx-auto">
              <TopMenu query={query} />
              <div className="mt-6 bg-white dark:bg-gray-800 shadow dark:shadow-gray-700/30 rounded-lg p-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeContextProvider>
  );
}
