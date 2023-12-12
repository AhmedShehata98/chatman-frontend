import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

function Portal({
  children,
  className = "modal",
}: {
  children: ReactNode;
  className?: string;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [container, setContainer] = useState(document.getElementById(""));
  useEffect(() => {
    setIsMounted(true);
    setContainer(document.getElementById(className));
    return () => {
      setIsMounted(false);
      setContainer(document.getElementById(""));
    };
  }, []);

  if (isMounted) {
    return createPortal(children, container as Element);
  }
  return null;
}

export default Portal;
