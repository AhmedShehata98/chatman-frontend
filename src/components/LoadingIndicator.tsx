import clsx from "clsx";

function LoadingIndicator({
  message,
  color,
  dir = "col",
  className,
  isShown,
}: {
  message?: string;
  color?: string;
  className?: string;
  dir?: "col" | "row";
  isShown: boolean;
}) {
  return (
    <div
      className={`${clsx(
        isShown
          ? "h-auto translate-y-0 opacity-100"
          : "pointer-events-none h-0 -translate-y-20 opacity-0 ",
      )} flex w-full flex-[${dir}] items-center overflow-hidden transition-all duration-500`}
      style={{ borderColor: color }}
    >
      <span
        className={`${clsx(
          className,
        )} inline-block h-14 w-14 animate-spin rounded-full border-4 border-secondary-100 border-l-transparent`}
      ></span>
      {message && <p>{message}</p>}
    </div>
  );
}

export default LoadingIndicator;
