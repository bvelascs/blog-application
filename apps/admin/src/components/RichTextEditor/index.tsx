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

  return (    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || 'no-api-key'}
      onInit={(evt, editor) => editorRef.current = editor}
      value={content}
      disabled={disabled}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 
          'charmap', 'preview', 'searchreplace', 'code',
          'fullscreen', 'table', 'help', 'wordcount',
          'media', 'emoticons', 'codesample'
        ],
        toolbar: [
          'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent',
          'removeformat | help | codesample | emoticons | link image media table | fullscreen'
        ],
        content_style: `
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            margin: 1rem;
            color: #333;
          }
          img { max-width: 100%; height: auto; }
          p { margin: 1em 0; }
          h1, h2, h3, h4, h5, h6 { margin: 1.5em 0 0.5em; }
          pre { background-color: #f4f4f4; padding: 1em; border-radius: 4px; }
          blockquote { border-left: 3px solid #ccc; margin: 1.5em 0; padding-left: 1em; }
        `,
        codesample_languages: [
          { text: 'JavaScript', value: 'javascript' },
          { text: 'TypeScript', value: 'typescript' },
          { text: 'HTML/XML', value: 'markup' },
          { text: 'CSS', value: 'css' },
          { text: 'Python', value: 'python' },
          { text: 'Java', value: 'java' }
        ],
        image_advtab: true,
        link_context_toolbar: true,
        relative_urls: false,
        remove_script_host: false,
        convert_urls: true,
        branding: false,
        promotion: false
      }}
      onEditorChange={onChange}
    />
  );
}

// Export as a dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(RichTextEditor), {
  ssr: false
})
