export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-3 px-8 border-t border-slate-800 bg-slate-950 text-slate-500 text-[10px] flex justify-between items-center w-full">
      <p suppressHydrationWarning={true}>
        © {currentYear} Carpet Flow. All rights reserved.
      </p>
      <p>Version 1.0.0</p>
    </footer>
  );
}