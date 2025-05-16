"use client"; // Marks this as a client-side component
import type { Post } from "@repo/db/data";
import { marked } from "marked"; // For converting markdown to HTML
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export function BlogDetail({ post }: { post: Post }) {
  // Initialize router for navigation
  const router = useRouter();

  // State management for form fields with default values from post or empty strings
  const [title, setTitle] = useState(post?.title || "");
  const [description, setDescription] = useState(post?.description || "");
  const [content, setContent] = useState(post?.content || "");
  const [imageUrl, setImageUrl] = useState(post?.imageUrl || "");
  const [tags, setTags] = useState(post?.tags || "");
  const [category, setCategory] = useState(post?.category || "");

  // State for form validation and UI feedback
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreview, setIsPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState(post?.imageUrl || "");
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reference for the content textarea (used for cursor position management)
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Form validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    // Check all required fields and add errors if missing
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (description.length > 200) newErrors.description = "Description is too long. Maximum is 200 characters";
    if (!content.trim()) newErrors.content = "Content is required";
    if (!imageUrl.trim()) newErrors.imageUrl = "Image URL is required";
    if (!tags.trim()) newErrors.tags = "At least one tag is required";
    if (!category.trim()) newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler for saving the post
  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (isSubmitting) return;    // Prevent double submission

    setIsSubmitting(true);
    try {
      // Prepare post data for submission
      const postData = {
        id: post?.id,
        title,
        description,
        content,
        imageUrl,
        tags,
        category,
        date: new Date().toISOString(),
        active: true,
        views: post?.views || 0,
        likes: post?.likes || 0,
        urlId: title.toLowerCase().replace(/\s+/g, "-"), // Create URL-friendly ID
      };

      // Choose endpoint based on whether this is an update or new post
      const endpoint = post?.id ? "/api/posts/update/post" : "/api/posts/create";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        setSuccessMessage("Post updated successfully");
        // Wait briefly before redirecting
        await new Promise(resolve => setTimeout(resolve, 500));
        window.location.href = "/"; // Force page reload
      } else {
        const errorData = await response.json();
        setErrors({ form: errorData.error || "Failed to save post" });
      }
    } catch (error) {
      setErrors({ form: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle between edit and preview modes
  const togglePreview = () => {
    if (isPreview) {
      // Restore cursor position when returning to edit mode
      if (contentRef.current && cursorPosition !== null) {
        contentRef.current.focus();
        contentRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    } else {
      // Save cursor position when entering preview mode
      if (contentRef.current) {
        setCursorPosition(contentRef.current.selectionStart);
      }
    }
    setIsPreview(!isPreview);
  };

  // Handle image URL changes and validate URL format
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setImageUrl(value);
    // Only show preview if URL matches image file pattern
    setImagePreview(value.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i) ? value : "");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {successMessage && (
        <div className="mb-4 rounded bg-green-100 p-4 text-center">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {errors.form && (
        <div className="mb-4 rounded bg-red-100 p-4 text-center">
          <p className="text-red-700">{errors.form}</p>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="mx-auto max-w-4xl space-y-6">
        <div>
          <label htmlFor="title" className="block font-bold">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full border-b border-gray-300 p-2 outline-none"
          />
          {errors.title && <p className="mt-1 text-red-500">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block font-bold">
            Category
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full border-b border-gray-300 p-2 outline-none"
          />
          {errors.category && <p className="mt-1 text-red-500">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block font-bold">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full border-b border-gray-300 p-2 outline-none"
            rows={5}
          />
          {errors.description && <p className="mt-1 text-red-500">{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="image-url" className="block font-bold">
            Image URL
          </label>
          <input
            id="image-url"
            type="text"
            value={imageUrl}
            onChange={handleImageUrlChange}
            className="mt-1 w-full border-b border-gray-300 p-2 outline-none"
          />
          {errors.imageUrl && <p className="mt-1 text-red-500">{errors.imageUrl}</p>}
          {imagePreview && (
            <img
              data-test-id="image-preview"
              src={imagePreview}
              alt="Preview"
              className="mt-4 max-h-96 rounded-lg object-cover"
            />
          )}
        </div>

        <div>
          <label htmlFor="content" className="block font-bold">
            Content
          </label>
          <textarea
            id="content"
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`mt-1 w-full border-b border-gray-300 p-2 outline-none ${isPreview ? "hidden" : "block"}`}
            rows={20}
          />
          <div
            data-test-id="content-preview"
            className={`prose mt-4 border p-4 ${isPreview ? "block" : "hidden"}`}
            dangerouslySetInnerHTML={{ __html: marked(content) }}
          />
          {errors.content && <p className="mt-1 text-red-500">{errors.content}</p>}
        </div>

        <div>
          <label htmlFor="tags" className="block font-bold">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 w-full border-b border-gray-300 p-2 outline-none"
          />
          {errors.tags && <p className="mt-1 text-red-500">{errors.tags}</p>}
        </div>

        <div className="flex justify-between py-4">
          <button
            type="button"
            onClick={togglePreview}
            className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            {isPreview ? "Close Preview" : "Preview"}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
