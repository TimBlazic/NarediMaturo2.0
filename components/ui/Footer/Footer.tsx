export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1920px] px-6">
      <div className="grid grid-cols-1 gap-8 py-12 text-white transition-colors duration-150 border-b lg:grid-cols-12 border-zinc-600">
        <div className="flex items-start col-span-1 text-white lg:col-span-6 lg:justify-end"></div>
      </div>
      <div className="flex flex-col items-center justify-between py-12 space-y-4 md:flex-row">
        <div className="text-black">
          <span>
            &copy; {new Date().getFullYear()} NarediMaturo, All rights reserved.
          </span>
        </div>
        {/* Dodajte dodatne elemente vašega footra tukaj */}
      </div>
    </footer>
  );
}
