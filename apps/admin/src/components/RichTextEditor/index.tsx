"use client";

import dynamic from 'next/dynamic'
import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
}

// Dynamic import with no SSR to avoid hydration issues
const RichTextEditor = ({ content, onChange, disabled }: RichTextEditorProps) => {
  const editorRef = useRef<any>(null);

  return (
    <Editor
      apiKey="your-api-key-here"
      onInit={(evt, editor) => editorRef.current = editor}
      value={content}
      disabled={disabled}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 
          'charmap', 'preview', 'searchreplace', 'code',
          'fullscreen', 'media', 'table', 'code', 'help', 
          'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
      }}
      onEditorChange={onChange}
    />
  );
}

// Export as a dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(RichTextEditor), {
  ssr: false
})
