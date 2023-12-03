"use client";
import { SessionProvider} from "next-auth/react";
import Link from "next/link";
import { Account } from "./Account";


export  function SideNav() {

  return (
    <SessionProvider>
      <nav className="sticky top-0 self-start px-2 py-4">
        <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
          <li>
            <Link href="/">Home</Link>
          </li>
          <Account/>
        </ul>
      </nav>
    </SessionProvider>
  );
}
