"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UploadItem = { url: string; uploading?: boolean };

/**
 * Photo picker for the admin panel: a big "Choose a photo" button (drag and
 * drop works too) with a preview of what's chosen. Uploads go straight to
 * Vercel Blob from the browser (see src/app/api/blob-upload/route.ts for the
 * token endpoint), then the resulting URL(s) are submitted as plain hidden
 * form fields so the rest of the form still works as a normal server-action
 * <form>.
 */
export function ImageUploader({
  name,
  label,
  helperText,
  multiple = false,
  optional = false,
  defaultUrls = [],
  onUploadingChange,
}: {
  name: string;
  label: string;
  helperText?: string;
  multiple?: boolean;
  optional?: boolean;
  defaultUrls?: string[];
  /** Lets the form hold its Save button until every photo has finished uploading. */
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const [items, setItems] = useState<UploadItem[]>(
    defaultUrls.map((url) => ({ url }))
  );
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => onUploadingChange?.(isPending), [isPending, onUploadingChange]);

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
          setError("That photo couldn’t be uploaded. Please try again, or choose a different photo.");
          setItems((prev) => prev.filter((item) => item !== placeholder));
        }
      }
    });
  }

  function removeAt(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  const chooseLabel = multiple
    ? items.length > 0
      ? "Add more photos"
      : "Choose photos"
    : items.length > 0
      ? "Choose a different photo"
      : "Choose a photo";

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xl font-semibold">
        {label}
        {optional && (
          <span className="ml-2 text-lg font-normal text-muted-foreground">
            (you can leave this empty)
          </span>
        )}
      </p>
      {helperText && <p className="-mt-1 mb-1 text-lg text-muted-foreground">{helperText}</p>}

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
          "flex flex-col items-center gap-5 rounded-xl border-2 border-dashed border-input bg-card p-6 text-center transition-colors",
          isDragging && "border-ring bg-muted/50"
        )}
      >
        {items.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-4">
            {items.map((item, i) => (
              <li key={item.url + i} className="flex flex-col items-center gap-2">
                <div className="relative size-36 overflow-hidden rounded-lg ring-1 ring-border">
                  <Image src={item.url} alt="" fill sizes="144px" className="object-cover" unoptimized={item.uploading} />
                  {item.uploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 text-lg font-medium text-white">
                      <Loader2 className="size-6 animate-spin" aria-hidden />
                      Uploading…
                    </div>
                  )}
                </div>
                {!item.uploading && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeAt(i)}
                    className="h-12 gap-1.5 px-3 text-lg text-muted-foreground hover:text-destructive"
                  >
                    <X aria-hidden />
                    Remove
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}

        <Button
          type="button"
          variant={items.length > 0 ? "outline" : "default"}
          size="xl"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus aria-hidden />
          {chooseLabel}
        </Button>
        <p className="text-lg text-muted-foreground">
          Or drag a photo from your computer onto this box.
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

      {error && (
        <p role="alert" className="text-lg font-medium text-destructive">
          {error}
        </p>
      )}

      {items
        .filter((item) => !item.uploading)
        .map((item, i) => (
          <input key={item.url + i} type="hidden" name={name} value={item.url} />
        ))}
    </div>
  );
}
