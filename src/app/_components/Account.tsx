"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function Account() {
  const session = useSession();

  const user = session.data?.user;
  return (
    <>
      {user != null && (
        <li>
          <Link href={`/profiles/${user.id}`}>Profile</Link>
        </li>
      )}
      {user != null && (
        <li>
          <button onClick={() => void signOut()}>Sign Out</button>
        </li>
      )}
      {user == null && (
        <li>
          <button onClick={() => void signIn()}>Sign in</button>
        </li>
      )}
    </>
  );
}
