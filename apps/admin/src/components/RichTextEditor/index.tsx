/**
 * Rich Text Editor Component
 * 
 * This component implements a fully featured WYSIWYG editor using TinyMCE.
 * It provides text formatting, media embedding, code samples, and other rich editing features.
 * The component is dynamically imported to avoid Server-Side Rendering (SSR) issues.
 */

"use client"; // Mark as client component since TinyMCE requires browser APIs

import dynamic from 'next/dynamic'
import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

/**
 * Props interface for the RichTextEditor component
 * 
 * @property {string} content - The current HTML content to display in the editor
 * @property {function} onChange - Callback function that receives updated content when changes occur
 * @property {boolean} disabled - Optional flag to disable editing (read-only mode)
 */
interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
}

/**
 * RichTextEditor component implementation
 * Uses dynamic import to avoid SSR hydration issues with TinyMCE
 */
const RichTextEditor = ({ content, onChange, disabled }: RichTextEditorProps) => {
  // Reference to access the editor instance if needed for programmatic control
  const editorRef = useRef<any>(null);

  return (    <Editor
      apiKey="fkr0mau2k250yjs08c9soyx8jh8u3o5lrpd508f8x9e41cxh" // TinyMCE Cloud API key
      onInit={(evt, editor) => editorRef.current = editor}
      // Set the initial content value
      value={content}
      // Control whether editor is interactive or read-only
      disabled={disabled}
      init={{
        // Editor height in pixels
        height: 500,
        // Show the menu bar with additional options
        menubar: true,
        // Enable a comprehensive set of editor plugins:
        plugins: [
          'advlist',     // Advanced list functionality
          'autolink',    // Automatically convert URLs to links
          'lists',       // Basic list support
          'link',        // Link insertion/editing
          'image',       // Image insertion/editing 
          'charmap',     // Special character insertion
          'preview',     // Content preview
          'searchreplace', // Search and replace functionality
          'code',        // Source code viewing/editing
          'fullscreen',  // Fullscreen editing mode
          'table',       // Table creation and editing
          'help',        // Help documentation
          'wordcount',   // Word/character counting
          'media',       // Media (video/audio) embedding
          'emoticons',   // Emoticon insertion
          'codesample'   // Code snippet formatting with syntax highlighting
        ],
        // Configure the editor toolbar with formatting options (split into two rows)
        toolbar: [
          // Row 1: Basic formatting and text organization
          'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent',
          // Row 2: Advanced features and media insertion
          'removeformat | help | codesample | emoticons | link image media table | fullscreen'
        ],
        // Custom CSS applied to the editor content area for consistent styling
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
        // Languages available for code samples with syntax highlighting
        codesample_languages: [
          { text: 'JavaScript', value: 'javascript' },
          { text: 'TypeScript', value: 'typescript' },
          { text: 'HTML/XML', value: 'markup' },
          { text: 'CSS', value: 'css' },
          { text: 'Python', value: 'python' },
          { text: 'Java', value: 'java' }
        ],
        // Enable advanced image options tab
        image_advtab: true,
        // Show context toolbar when selecting links
        link_context_toolbar: true,
        // URL handling for links and images
        relative_urls: false,
        remove_script_host: false,
        convert_urls: true,
        // Remove TinyMCE branding
        branding: false,
        // Disable promotion messages
        promotion: false      }}
      // Pass content changes to the parent component via onChange callback
      onEditorChange={onChange}
    />
  );
}

export default dynamic(() => Promise.resolve(RichTextEditor), {
  ssr: false // Server-Side Rendering disabled
})
