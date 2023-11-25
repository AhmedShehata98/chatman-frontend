import { RecoilRoot } from "recoil";
import { ReactNode } from "react";

function RecoilWrapper({ children }: { children: ReactNode }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}

export default RecoilWrapper;
