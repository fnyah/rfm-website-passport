"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";
import { Bold, Italic, Link as LinkIcon, List, ListOrdered, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { plainTextToHtml } from "@/lib/plain-text";
import { cn } from "@/lib/utils";

/**
 * A small, deliberately limited rich-text editor for the admin panel: bold,
 * italic, links, and lists only — no font/color/heading chaos to confuse a
 * non-technical editor. Every toolbar button says what it does in words.
 * Outputs sanitized-on-render HTML (see src/lib/sanitize.ts) into a hidden
 * input so it works with a plain server-action <form>.
 */
export function RichTextEditor({
  id,
  name,
  defaultValue = "",
  label,
  placeholder,
}: {
  id?: string;
  name: string;
  defaultValue?: string;
  label: string;
  placeholder?: string;
}) {
  const [html, setHtml] = useState(defaultValue);
  const [linkOpen, setLinkOpen] = useState(false);
  const [, rerender] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    // Legacy plain text keeps its paragraphs when loaded for editing.
    content: plainTextToHtml(defaultValue),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose-content outline-none",
        "aria-label": label,
        ...(id ? { id } : {}),
      },
    },
    // An emptied editor still holds "<p></p>"; send nothing so the form's
    // "please enter some text" check catches it.
    onUpdate: ({ editor }) => setHtml(editor.isEmpty ? "" : editor.getHTML()),
    // Keep the pressed state of the toolbar buttons in step with the cursor.
    onSelectionUpdate: () => rerender((n) => n + 1),
  });

  return (
    <div className="rounded-lg border-2 border-input bg-card focus-within:border-ring">
      {editor && (
        <div
          role="toolbar"
          aria-label="Text style"
          className="flex flex-wrap items-center gap-2 border-b-2 border-input p-2"
        >
          <ToolButton
            editor={editor}
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            icon={<Bold />}
          >
            Bold
          </ToolButton>
          <ToolButton
            editor={editor}
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            icon={<Italic />}
          >
            Italic
          </ToolButton>
          <ToolButton
            editor={editor}
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            icon={<List />}
          >
            Bullet list
          </ToolButton>
          <ToolButton
            editor={editor}
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            icon={<ListOrdered />}
          >
            Numbered list
          </ToolButton>
          {editor.isActive("link") ? (
            <ToolButton
              editor={editor}
              onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
              icon={<Unlink />}
            >
              Remove link
            </ToolButton>
          ) : (
            <ToolButton
              editor={editor}
              active={linkOpen}
              onClick={() => setLinkOpen((open) => !open)}
              icon={<LinkIcon />}
            >
              Add a link
            </ToolButton>
          )}
        </div>
      )}
      {editor && linkOpen && (
        <LinkForm
          onCancel={() => {
            setLinkOpen(false);
            editor.commands.focus();
          }}
          onAdd={(href) => {
            setLinkOpen(false);
            const chain = editor.chain().focus();
            if (editor.state.selection.empty) {
              // Nothing selected: insert the address itself as the link text.
              chain.insertContent({ type: "text", text: href, marks: [{ type: "link", attrs: { href } }] }).run();
            } else {
              chain.setLink({ href }).run();
            }
          }}
        />
      )}
      <EditorContent
        editor={editor}
        className={cn(
          "[&_.ProseMirror]:min-h-40 [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 [&_.ProseMirror]:text-lg [&_.ProseMirror]:leading-relaxed",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
        )}
      />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}

function ToolButton({
  editor,
  active,
  onClick,
  icon,
  children,
}: {
  editor: Editor;
  active?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      aria-pressed={active}
      disabled={!editor.isEditable}
      onClick={onClick}
      className={cn(
        "h-12 gap-2 px-3 text-lg",
        active && "bg-primary/10 text-primary ring-2 ring-primary/40"
      )}
    >
      {icon}
      {children}
    </Button>
  );
}

function LinkForm({
  onAdd,
  onCancel,
}: {
  onAdd: (href: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState("");

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(/^[a-z]+:/i.test(trimmed) ? trimmed : `https://${trimmed}`);
  }

  return (
    <div className="flex flex-col gap-3 border-b-2 border-input bg-muted/50 p-4">
      <label htmlFor="rich-text-link" className="text-lg font-semibold">
        Web address for the link
      </label>
      <p className="-mt-2 text-lg text-muted-foreground">
        Select some words first to turn them into a link, or the address itself is added.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id="rich-text-link"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            // Enter adds the link instead of submitting the whole form.
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
            if (e.key === "Escape") onCancel();
          }}
          placeholder="www.example.com"
          className="h-12 flex-1 border-2 bg-card px-4 text-lg md:text-lg"
        />
        <Button type="button" size="xl" onClick={submit}>
          Add link
        </Button>
        <Button type="button" size="xl" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
