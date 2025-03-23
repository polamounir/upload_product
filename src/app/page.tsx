'use cLient'
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex justify-center items-center h-dvh pb-30">
        <Link href="/upload" className="px-10 py-5 text-xl font-bold bg-sky-500 text-white hover:bg-sky-600 rounded-lg duration-500 focus:bg-sky-700"> ADD PRODUT</Link>
      </div>
    </div>
  );
}
