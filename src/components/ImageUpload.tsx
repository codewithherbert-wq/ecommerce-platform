"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
};

export function ImageUpload({ value, onChange, label, className }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Upload failed (${res.status})`);
      }
      const { url } = (await res.json()) as { url: string };
      onChange(url);
      toast.success("Uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      {label && (
        <span className="mb-1 block text-sm font-medium">{label}</span>
      )}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative flex h-44 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-dashed text-sm transition ${
          dragOver
            ? "border-[var(--shop-accent)] bg-amber-50/40 dark:bg-amber-900/10"
            : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500"
        }`}
      >
        {value ? (
          <>
            {/* Use plain <img> for arbitrary upload paths */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              aria-label="Remove image"
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-500">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
            <span className="text-xs">
              {uploading
                ? "Uploading…"
                : "Drag & drop or click to upload (PNG/JPG/WebP)"}
            </span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            // Reset so same file can be re-selected
            e.target.value = "";
          }}
        />
      </div>
      {value && (
        <p className="mt-1 truncate text-xs text-gray-500" title={value}>
          {value}
        </p>
      )}
    </div>
  );
}
