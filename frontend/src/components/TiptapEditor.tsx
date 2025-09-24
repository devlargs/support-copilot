import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

interface TiptapEditorProps {
  placeholder?: string;
  content?: string;
  onChange?: (content: string) => void;
  className?: string;
}

export default function TiptapEditor({
  placeholder = "Start typing...",
  content = "",
  onChange,
  className = "",
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={`border border-gray-300 dark:border-gray-600 rounded-lg ${className}`}
    >
      <div className="border-b border-gray-200 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700">
        <div className="flex space-x-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 text-sm rounded ${
              editor.isActive("bold")
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500"
            }`}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 text-sm rounded ${
              editor.isActive("italic")
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500"
            }`}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 text-sm rounded ${
              editor.isActive("bulletList")
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500"
            }`}
          >
            •
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-2 py-1 text-sm rounded ${
              editor.isActive("orderedList")
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500"
            }`}
          >
            1.
          </button>
        </div>
      </div>
      <div className="p-3 bg-white dark:bg-gray-800">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none focus:outline-none dark:prose-invert"
        />
      </div>
    </div>
  );
}
