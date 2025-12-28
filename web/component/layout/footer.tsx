import Link from "next/link";

export default function Footer() {
  return (
    <footer className="pt-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col justify-between items-start md:flex-row gap-10 md:gap-0">
        

        <div className="flex flex-col gap-10">
          <div>
            <h2 className="text-lg flex items-center gap-2 font-semibold tracking-tight">
              <div className="bg-blue-700 size-6 flex justify-end items-baseline-last">
                <div className="rounded-full size-3 bg-white"></div>
              </div>
              INSPOSITE
            </h2>
            <p className="mt-2 text-neutral-500  max-w-8/12">
              Curated inspiration for people who build.
            </p>
          </div>


          <p className=" mt-2 font-serif text-xl text-blue-700">
            Crafted with care — Prasanjit Dey
          </p>
        </div>

        <div className="flex flex-col gap-2 text-right">



          <div className="mt-1 flex flex-col  justify-between items-start gap-2 text-base">
            <h1 className="font-semibold">Explore</h1>
            <Link href="/about" className=" hover:text-blue-700 text-neutral-500">
            About
            </Link>

            <Link href="https://x.com/Prasanjit_ui" target="_blank" className="hover:text-blue-700 text-neutral-500">
              Twitter / X
            </Link> 

            <Link href="https://github.com/prasanjit-dey-ux/" target="_blank" className="hover:text-blue-700 text-neutral-500">
              GitHub
            </Link> 
          </div>
        </div>

      </div>

      <p className="mt-10 border-t py-2 border-gray-200 text-center md:text-sm text-neutral-500 text-xs">
        © 2025 INSPOSITE — All linked content belongs to respective creators.
      </p>
    </footer>
  );
}
