"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
};

export function MultiImageUpload({ values, onChange, label }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const upload = async (files: FileList) => {
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/uploads", { method: "POST", body: fd });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error ?? `Upload failed (${res.status})`);
        }
        const { url } = (await res.json()) as { url: string };
        urls.push(url);
      }
      onChange([...values, ...urls]);
      toast.success(`Uploaded ${urls.length} image${urls.length === 1 ? "" : "s"}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (i: number) => {
    onChange(values.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      {label && <span className="mb-1 block text-sm font-medium">{label}</span>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {values.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="relative h-28 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label="Remove image"
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-28 flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-gray-300 text-xs text-gray-500 hover:border-gray-400 dark:border-gray-700"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
          {uploading ? "Uploading…" : "Add images"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) upload(files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
