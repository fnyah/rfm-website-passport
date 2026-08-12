"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";
import { Bold, Italic, Link as LinkIcon, List, ListOrdered } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

/**
 * A small, deliberately limited rich-text editor for the admin panel: bold,
 * italic, links, and lists only — no font/color/heading chaos to confuse a
 * non-technical editor. Outputs sanitized-on-render HTML (see
 * src/lib/sanitize.ts) into a hidden input so it works with a plain
 * server-action <form>.
 */
export function RichTextEditor({
  name,
  defaultValue = "",
  label,
  placeholder,
}: {
  name: string;
  defaultValue?: string;
  label: string;
  placeholder?: string;
}) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose-content min-h-32 rounded-b-lg px-3 py-2 text-sm outline-none",
        "aria-label": label,
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  return (
    <div className="rounded-lg border border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
      {editor && (
        <div className="flex items-center gap-1 border-b border-input p-1">
          <Toggle
            size="sm"
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            aria-label="Bold"
          >
            <Bold className="size-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            aria-label="Italic"
          >
            <Italic className="size-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("bulletList")}
            onPressedChange={() =>
              editor.chain().focus().toggleBulletList().run()
            }
            aria-label="Bulleted list"
          >
            <List className="size-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("orderedList")}
            onPressedChange={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
            aria-label="Numbered list"
          >
            <ListOrdered className="size-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("link")}
            onPressedChange={() => {
              if (editor.isActive("link")) {
                editor.chain().focus().unsetLink().run();
                return;
              }
              const url = window.prompt("Link URL");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            aria-label="Link"
          >
            <LinkIcon className="size-4" />
          </Toggle>
        </div>
      )}
      <EditorContent
        editor={editor}
        className={cn(
          "[&_.ProseMirror]:min-h-32 [&_.ProseMirror]:px-3 [&_.ProseMirror]:py-2 [&_.ProseMirror]:text-sm [&_.ProseMirror]:outline-none",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
        )}
      />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
