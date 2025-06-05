"use client"; // Marks this as a client-side component
import type { Post } from "@repo/db/data";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="min-h-[500px] w-full animate-pulse bg-gray-100 rounded-md"></div>
});

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
  const [successMessage, setSuccessMessage] = useState("");  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Reference for the content textarea (used for cursor position management)
  const contentRef = useRef<HTMLTextAreaElement>(null);// Form validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate title
    if (!title.trim()) newErrors.title = "Title is required";
    
    // Validate description
    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length > 200) {
      newErrors.description = "Description is too long. Maximum is 200 characters";
    }
    
    // Validate other fields
    if (!content.trim()) newErrors.content = "Content is required";
    
    // Validate image URL
    if (!imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
    } else if (!imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i)) {
      newErrors.imageUrl = "This is not a valid URL";
    }
    
    if (!tags.trim()) newErrors.tags = "At least one tag is required";
    if (!category.trim()) newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  // Handler for deleting the post
  const handleDelete = async () => {
    if (!post?.id) return;
    
    // Confirm deletion with user
    if (!window.confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
      return;
    }
    
    setIsDeleting(true);
    setDeleteError("");
    
    try {
      const response = await fetch(`/api/posts/delete?id=${post.id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        // Redirect to main page after successful deletion
        router.push("/");
      } else {
        const data = await response.json();
        setDeleteError(data.error || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setDeleteError("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler for saving the post
  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    // Always validate to ensure error messages are shown
    validateForm();
    // Return early if there are validation errors
    if (Object.keys(errors).length > 0 || !validateForm()) {
      setErrors(prev => ({...prev, form: "Please fix the errors before saving"}));
      return;
    }
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
    
    // Validate URL format immediately
    if (value && !value.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i)) {
      setErrors(prev => ({...prev, imageUrl: "This is not a valid URL"}));
    } else {
      setErrors(prev => {
        const {imageUrl, ...rest} = prev;
        return rest;
      });
      // Only show preview if URL matches image file pattern
      setImagePreview(value);
    }
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file as Blob);
    
    setIsUploading(true);
    
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok && data.imageUrl) {
        setImageUrl(data.imageUrl);
        setImagePreview(data.imageUrl);
        setErrors(prev => {
          const { imageUrl, ...rest } = prev;
          return rest;
        });
      } else {
        setErrors(prev => ({
          ...prev, 
          imageUrl: data.error || "Failed to upload image"
        }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrors(prev => ({
        ...prev, 
        imageUrl: "Failed to upload image"
      }));
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with WSU styling */}
      <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-5">
        <div className="flex items-center mb-4">
          <div className="bg-[#a31631] w-1 h-8 mr-3"></div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Blog Post</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Make changes to your blog post below.</p>
      </div>
      
      {successMessage && (
        <div className="mb-4 rounded bg-green-100 dark:bg-green-900/30 p-4 text-center">
          <p className="text-green-700 dark:text-green-400">{successMessage}</p>
        </div>
      )}

      {errors.form && (
        <div className="mb-4 rounded bg-red-100 dark:bg-red-900/30 p-4 text-center">
          <p className="text-red-700 dark:text-red-400">{errors.form}</p>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="mx-auto max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {/* Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#a31631] focus:border-[#a31631] transition-colors duration-200"
            placeholder="Enter post title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              const value = e.target.value;
              setDescription(value);
              // Validate length immediately
              const tooLong = value.length > 200;
              setErrors(prev => {
                const {description, ...rest} = prev;
                if (tooLong) {
                  return {...rest, description: "Description is too long. Maximum is 200 characters"};
                }
                return rest;
              });
            }}
            data-testid="description-input"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#a31631] focus:border-[#a31631] transition-colors duration-200"
            rows={3}
            placeholder="Brief summary of the post"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
        </div>

        {/* Content */}
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content
          </label>
          <div className={`border border-gray-300 dark:border-gray-600 rounded-md shadow-sm overflow-hidden ${isPreview ? 'hidden' : 'block'}`}>
            <RichTextEditor
              content={content}
              onChange={setContent}
              disabled={false}
            />
          </div>
          <div
            data-test-id="content-preview"
            className={`prose dark:prose-invert mt-4 border border-gray-300 dark:border-gray-600 p-4 rounded-md ${isPreview ? 'block' : 'hidden'}`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {errors.content && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.content}</p>}
        </div>

        {/* Image Upload and URL */}
        <div className="mb-6">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL
          </label>
          <input
            id="imageUrl"
            type="text"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setImagePreview(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#a31631] focus:border-[#a31631] transition-colors duration-200"
            placeholder="Enter image URL"
          />

          {errors.imageUrl && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.imageUrl}</p>}

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <img
                  data-test-id="image-preview"
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-96 w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="React, DevOps, Node, etc."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#a31631] focus:border-[#a31631] transition-colors duration-200"
          />
          {errors.category && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>}
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Front-end, Databases, Dev Tools"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#a31631] focus:border-[#a31631] transition-colors duration-200"
          />
          {errors.tags && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tags}</p>}
        </div>

        {/* Form feedback and submission section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
          {/* Error and success messages */}
          <div className="mb-4">
            {errors.form && (
              <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 dark:text-red-400">{errors.form}</p>
                  </div>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700 dark:text-green-400">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-between space-x-3">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={togglePreview}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a31631] transition-colors duration-200"
              >
                {isPreview ? "Close Preview" : "Preview"}
              </button>
              
              {/* Only show delete button if editing an existing post */}
              {post?.id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 dark:disabled:bg-red-800 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline-block text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Delete Post"
                  )}
                </button>
              )}
            </div>

            {/* Save button */}            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#a31631] hover:bg-[#853846] dark:bg-[#853846] dark:hover:bg-[#a31631] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a31631] disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
