"use client";

import { useState } from "react";
import { toast } from "sonner";

export function ContactForm({ supportEmail }: { supportEmail: string | null }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    if (supportEmail) {
      // Open the user's mail client with a pre-filled message.
      const subject = encodeURIComponent(`Support request from ${name}`);
      const body = encodeURIComponent(`${message}\n\n—\nFrom: ${name} <${email}>`);
      window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
      toast.success("Opening your email app…");
    } else {
      toast.success("Thanks! We'll be in touch soon.");
      setName("");
      setEmail("");
      setMessage("");
    }
    setSending(false);
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
    >
      <h2 className="text-lg font-semibold">Send a message</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Your name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          />
        </label>
      </div>
      <label className="mt-3 block">
        <span className="text-sm font-medium">Message</span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
      </label>
      <div className="mt-4 flex items-center justify-end">
        <button
          type="submit"
          disabled={sending}
          className="rounded-md bg-[var(--shop-primary)] px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
