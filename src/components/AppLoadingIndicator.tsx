function AppLoadingIndicator() {
  return (
    <div className="h-dynamic-screen fixed inset-0 z-50 flex w-full items-center justify-center bg-primary-100">
      <section className="flex flex-col items-center justify-center">
        <span className="inline-block h-20 w-20 animate-spin rounded-full border-8 border-secondary-100 border-t-primary-300"></span>
        <p className="mt-8 font-semibold uppercase text-zinc-200">
          wait a moment , loading ...
        </p>
      </section>
    </div>
  );
}

export default AppLoadingIndicator;
