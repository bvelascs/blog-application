// This file is for creating blog posts.
"use client"; // Marks this as a client-side component in Next.js

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="min-h-[500px] w-full animate-pulse bg-gray-100 rounded-md"></div>
});

export default function Page() {
  // Initialize form state with default values
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    imageUrl: "",
    date: new Date().toISOString().slice(0, 10),
    category: "",
    views: 0,     // New posts will start with 0 views
    active: true, // Posts are active by default
    tags: "",
  });

  // State for handling validation errors and success messages
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const router = useRouter(); // Next.js router for navigation

  // Handle image upload
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
        setFormData(prev => ({
          ...prev,
          imageUrl: data.imageUrl
        }));
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

  // Handle changes in form inputs
  // Works with text inputs, textareas, and checkboxes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | any>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value, // Special handling for checkbox inputs
    }));

    // Update image preview when URL changes
    if (id === "imageUrl") {
      if (value && /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(value)) {
        setImagePreview(value);
      }
    }
  };

  // Validate form inputs before submission
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required field validation
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";

    // Image URL validation with regex pattern
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
    } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(formData.imageUrl)) {
      newErrors.imageUrl = "This is not a valid URL";
    }

    // Additional required fields
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.tags.trim()) newErrors.tags = "At least one tag is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) return; // Stop if validation fails

    try {
      // Send POST request to create new blog post
      const response = await fetch(`/api/posts/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Post created successfully");
        // Wait briefly to show success message then redirect
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/");
      } else {
        // Handle API error response
        const errorResponse = await response.json();
        setErrors({ form: errorResponse.error || "Failed to create post" });
      }
    } catch (error) {
      setErrors({ form: "An unexpected error occurred" });
    }
  };
  // Form JSX markup with Tailwind CSS styling
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Header with WSU styling */}
      <div className="mb-8 border-b border-gray-200 pb-5">
        <div className="flex items-center mb-4">
          <div className="bg-[#a31631] w-1 h-8 mr-3"></div>
          <h1 className="text-3xl font-bold">Create Blog Post</h1>
        </div>
        <p className="text-gray-600">Fill in the details below to create a new blog post.</p>
      </div>

      <form className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a31631] focus:border-[#a31631]"
            placeholder="Enter post title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a31631] focus:border-[#a31631]"
            rows={3}
            placeholder="Brief summary of the post"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>        {/* Content */}
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <div className="border border-gray-300 rounded-md shadow-sm overflow-hidden">
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              disabled={false}
            />
          </div>
          {errors.content && <p className="mt-2 text-sm text-red-600">{errors.content}</p>}
        </div>        {/* Image Upload and URL */}
        <div className="mb-6">
          <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image
          </label>

          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Upload a new image:</p>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#a31631] file:text-white
                    hover:file:bg-[#853846] cursor-pointer"
                />
                {isUploading && (
                  <div className="mt-2 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#a31631] mr-2"></div>
                    <span className="text-sm text-[#a31631]">Uploading...</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Or enter an image URL:</p>
                <input
                  id="imageUrl"
                  type="text"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  disabled={isUploading}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a31631] focus:border-[#a31631]"
                />
              </div>
            </div>

            {errors.imageUrl && <p className="mt-2 text-sm text-red-600">{errors.imageUrl}</p>}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-96 w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>        {/* Post details grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Publication Date
            </label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a31631] focus:border-[#a31631]"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              id="category"
              type="text"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="React, DevOps, Node, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a31631] focus:border-[#a31631]"
            />
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Views */}
          <div>
            <label htmlFor="views" className="block text-sm font-medium text-gray-700 mb-1">
              Views
            </label>
            <input
              id="views"
              type="number"
              value={formData.views}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a31631] focus:border-[#a31631]"
            />
            <p className="mt-1 text-xs text-gray-500">Initial view count for this post</p>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              id="tags"
              type="text"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="Front-end, Databases, Dev Tools"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a31631] focus:border-[#a31631]"
            />
            {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags}</p>}
          </div>
        </div>

        {/* Status settings */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center">
            <input
              id="active"
              type="checkbox"
              checked={formData.active}
              onChange={handleInputChange}
              className="h-4 w-4 text-[#a31631] focus:ring-[#a31631] border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
              Publish this post (make it visible to readers)
            </label>
          </div>
        </div>        {/* Form feedback and submission section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          {/* Error and success messages */}
          <div className="mb-4">
            {errors.form && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.form}</p>
                  </div>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a31631]"
              onClick={() => router.push("/")}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isUploading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#a31631] hover:bg-[#853846] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a31631] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>Publish Post</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
