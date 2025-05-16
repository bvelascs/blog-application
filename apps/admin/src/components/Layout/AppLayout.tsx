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
    <ThemeContextProvider>
      <AdminMenu />
      <div className="container mx-auto flex">
        {/* <LeftMenu /> */}
        <Content>
          <TopMenu query={query} />
          {children}
        </Content>
      </div>
    </ThemeContextProvider>
  );
}
