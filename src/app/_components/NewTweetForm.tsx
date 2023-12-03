"use client";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";
import {
  FormEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";

function updateTextAreaSize(textarea?: HTMLTextAreaElement) {
  if (textarea == null) return;
  textarea.style.height = "0";
  textarea.style.height = `${textarea.scrollHeight}px`;
}
export function NewTweetForm() {
  const session = useSession();
  if (session.status !== "authenticated") return;
  return <Form />;
}

function Form() {
  const session = useSession();
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  const createtweet = api.tweet.create.useMutation({
    onSuccess: (newtweet) => {
      console.log(newtweet);
      
      setInputValue("");
    },
  });

  if (!session.data?.user) return;
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createtweet.mutate({ name: inputValue });
  }
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 border-b px-4 py-2"
      >
        <div className="flex gap-4">
          <ProfileImage src={session.data.user.image} />
          <textarea
            ref={inputRef}
            style={{ height: 0 }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
            placeholder="What's new?"
          />
        </div>
        <Button className="self-end">tweet</Button>
      </form>
    </>
  );
}
