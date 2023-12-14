import clsx from "clsx";
import { ReactNode, forwardRef } from "react";

const LandscapeModal = forwardRef<
  HTMLDialogElement,
  {
    children: ReactNode;
    className?: string;
  }
>(({ children, className }, ref) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <dialog
        ref={ref}
        className={`flex h-[calc(100dvh-3.5rem)] w-96 flex-col items-start justify-start rounded-md bg-primary-200 p-4 shadow-lg max-md:w-10/12 ${clsx(
          className,
        )}`}
      >
        {children}
      </dialog>
    </div>
  );
});
// function LandscapeModal({
//   children,
//   className,
// }: {
//   children: ReactNode;
//   className?: string;
// }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-50">
//       <div
//         className={`flex h-[calc(100dvh-3.5rem)] w-96 flex-col items-start justify-start rounded-md bg-primary-200 p-4 shadow-lg max-md:w-3/4 ${clsx(
//           className,
//         )}`}
//       >
//         {children}
//       </div>
//     </div>
//   );
// }

export default LandscapeModal;
