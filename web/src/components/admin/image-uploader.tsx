"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type UploadItem = { url: string; uploading?: boolean };

/**
 * Drag-and-drop photo uploader for the admin panel. Uploads go straight to
 * Vercel Blob from the browser (see src/app/api/blob-upload/route.ts for the
 * token endpoint) with a visible progress state, then the resulting URL(s)
 * are submitted as plain hidden form fields so the rest of the form still
 * works as a normal server-action <form>.
 */
export function ImageUploader({
  name,
  label,
  helperText,
  multiple = false,
  defaultUrls = [],
}: {
  name: string;
  label: string;
  helperText?: string;
  multiple?: boolean;
  defaultUrls?: string[];
}) {
  const [items, setItems] = useState<UploadItem[]>(
    defaultUrls.map((url) => ({ url }))
  );
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    const list = multiple ? Array.from(files) : [files[0]];

    startTransition(async () => {
      for (const file of list) {
        const placeholder: UploadItem = { url: URL.createObjectURL(file), uploading: true };
        setItems((prev) => (multiple ? [...prev, placeholder] : [placeholder]));

        try {
          const result = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/blob-upload",
          });
          setItems((prev) =>
            prev.map((item) => (item === placeholder ? { url: result.url } : item))
          );
        } catch {
          setError("Couldn't upload that photo. Please try again.");
          setItems((prev) => prev.filter((item) => item !== placeholder));
        }
      }
    });
  }

  function removeAt(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-lg border-2 border-dashed border-input p-4 text-center transition-colors",
          isDragging && "border-ring bg-muted/50"
        )}
      >
        {items.length > 0 && (
          <div className="mb-3 flex flex-wrap justify-center gap-3">
            {items.map((item, i) => (
              <div
                key={item.url + i}
                className="relative size-24 overflow-hidden rounded-md ring-1 ring-border"
              >
                <Image src={item.url} alt="" fill sizes="96px" className="object-cover" unoptimized={item.uploading} />
                {item.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Loader2 className="size-5 animate-spin text-white" />
                  </div>
                )}
                {!item.uploading && (
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    aria-label="Remove photo"
                    className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="size-4" />
          {multiple ? "Add photos" : items.length > 0 ? "Replace photo" : "Add a photo"}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          Drag a photo here, or click to browse. JPG, PNG, WEBP, or GIF.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {items
        .filter((item) => !item.uploading)
        .map((item, i) => (
          <input key={item.url + i} type="hidden" name={name} value={item.url} />
        ))}
    </div>
  );
}
