import { ReactNode } from "react";
import Header from "./Header";
import SideMenu from "./SideMenu";

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main className="bg-primary-200 h-screen w-full">
      <Header />
      <section className="flex items-start justify-start">
        <SideMenu />
        {children}
      </section>
    </main>
  );
}

export default MainLayout;
