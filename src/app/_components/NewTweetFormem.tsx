"use client";
import { SessionProvider } from "next-auth/react";
import { NewTweetForm } from "./NewTweetForm";


export function NewTweetFormem() {
  return <SessionProvider>
    <NewTweetForm/>
    </SessionProvider>;
}
