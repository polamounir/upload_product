import Link from "next/link";

export default function Header() {
    return (
        <header className="">
            <div className="">
                <nav className="flex items-center justify-center w-full  bg-white shadow p-5">
                    <div className="flex items-center justify-center gap-10 w-full">
                        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-gray-900">
                            Home
                        </Link>
                        <Link href="/upload" className="text-2xl font-bold text-gray-800 hover:text-gray-900">
                            ADD
                        </Link>
                        <Link href="view" className="text-2xl font-bold text-gray-800 hover:text-gray-900">
                            View
                        </Link>
                    </div>

                </nav>

            </div>
        </header>
    )
}
