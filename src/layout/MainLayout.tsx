import { ReactNode } from "react";
import Header from "./Header";
import SideMenu from "./SideMenu";

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main className="w-full h-screen bg-[#0B141A]">
      <Header />
      <section className="flex items-start justify-start">
        <SideMenu />
        {children}
      </section>
    </main>
  );
}

export default MainLayout;
