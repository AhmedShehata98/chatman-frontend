function Header() {
  return (
    <header className="w-full bg-[#202C33] px-4">
      <div className="flex w-full items-center justify-start gap-3 py-3">
        <span className="text-4xl text-emerald-500">
          <i className="fi fi-brands-whatsapp"></i>
        </span>
        <p className="text-lg font-medium uppercase text-white">chatman</p>
      </div>
    </header>
  );
}

export default Header;
