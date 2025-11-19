"use client";

import { useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import type { IJodit } from "jodit-react";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface RichTextEditorProps {
  value: string; 
  onChange: (content: string) => void; 
  placeholder?: string; 
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing your story...",
}: RichTextEditorProps) {
  
  const editorRef = useRef<IJodit | null>(null);

  const config = useMemo(
    () => ({
      placeholder: placeholder,
      readonly: false, 
      height: 500, 
      
      buttons: [
        "bold", 
        "italic", 
        "underline", 
        "|", 
        "ul", 
        "ol", 
        "|", 
        "outdent", 
        "indent", 
        "|", 
        "font", 
        "fontsize", 
        "paragraph", 
        "|",
        "image", 
        "link", 
        "|", 
        "align", 
        "|", 
        "undo",
        "redo", 
        "|", 
        "hr", 
        "eraser", 
        "fullsize", 
      ],

      uploader: {
        insertImageAsBase64URI: true, 
      },

      link: {
        openInNewTab: true, 
      },

      spellcheck: true,

      removeEmptyBlocks: true,

      showToolbar: true,
    }),
    [placeholder]
  );

  const handleChange = (newContent: string) => {
    onChange(newContent);
  };

  return (
    <div className="rich-text-editor">
      <JoditEditor
        ref={editorRef}
        value={value}
        config={config}
        onBlur={handleChange} 
        onChange={handleChange} 
      />
    </div>
  );
}