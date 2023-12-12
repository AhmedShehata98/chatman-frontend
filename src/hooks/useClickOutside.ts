import { SetStateAction } from "react";
import { Dispatch } from "react";
import React from "react";

function useClickOutside({
  setShowModal,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const modalRef = React.useRef<any | null>(null);

  const handleCloseWithElement = (ev: MouseEvent) => {
    const target = ev.target as HTMLElement;
    if (target.contains(modalRef.current)) {
      setShowModal(false);
    }
  };
  React.useEffect(() => {
    document.addEventListener("click", handleCloseWithElement);
    return () => {
      document.removeEventListener("click", handleCloseWithElement);
    };
  }, [handleCloseWithElement]);

  return { modalRef };
}

export default useClickOutside;
