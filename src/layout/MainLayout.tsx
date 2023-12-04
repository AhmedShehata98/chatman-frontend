import { ReactNode } from "react";
import SideMenu from "./SideMenu";

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main className="h-screen w-full bg-primary-200">
      <section className="flex items-start justify-start">
        <SideMenu />
        {children}
      </section>
    </main>
  );
}

export default MainLayout;
