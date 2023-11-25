function LoadingIndicator({
  message,
  color,
  dir = "col",
}: {
  message?: string;
  color?: string;
  dir?: "col" | "row";
}) {
  return (
    <div className={`flex flex-${dir} items-center justify-center gap-6`}>
      <span
        style={{ borderColor: color }}
        className="flex w-full aspect-square rounded-full border-4 border-[#f9f9fa] border-b-[#94bdb6] animate-spin"
      ></span>
      {message ? (
        <p className="w-full text-sm font-medium uppercase">{message}</p>
      ) : null}
    </div>
  );
}

export default LoadingIndicator;
