import { ReactNode } from "react";
import SideMenu from "./SideMenu";
import mainAppBg from "../assets/main-app-bg.jpg";

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main
      style={{ backgroundImage: `url(${mainAppBg})` }}
      className={`relative z-10 h-screen w-full bg-cover bg-center bg-no-repeat after:absolute after:inset-0 after:z-[-1] after:bg-slate-600 after:bg-opacity-50`}
    >
      <section className="relative flex items-start justify-start">
        <SideMenu />
        {children}
      </section>
    </main>
  );
}

export default MainLayout;
