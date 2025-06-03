import { type PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";
import { ThemeContextProvider } from "../Themes/ThemeContext";

export async function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {  return (
    <ThemeContextProvider>
      <div className="container mx-auto flex shadow-2xl dark:shadow-gray-800/30 bg-white dark:bg-gray-900 min-h-screen">
        <LeftMenu />
        <Content>
          <TopMenu query={query} />
          <div className="pt-2 pb-8">
            {children}
          </div>
        </Content>
      </div>
    </ThemeContextProvider>
  );
}
