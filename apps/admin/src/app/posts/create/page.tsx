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
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <form className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="font-bold">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border-b-1 border-gray-300 outline-0"
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="font-bold">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border-b-1 border-gray-300 outline-0"
            rows={3}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
        </div>        {/* Content */}
        <div>
          <label htmlFor="content" className="font-bold block mb-2">
            Content
          </label>
          <div className="border rounded-md">
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              disabled={false}
            />
          </div>
          {errors.content && <p className="mt-2 text-red-500">{errors.content}</p>}
        </div>

        {/* Image Upload and URL */}
        <div>
          <label htmlFor="image-upload" className="font-bold block">
            Image
          </label>
          
          {/* Image Upload Section */}
          <div className="mt-2 flex flex-col gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Upload a new image:</p>
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {isUploading && <span className="mt-2 inline-block text-blue-600">Uploading...</span>}
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Or enter an image URL:</p>
              <input
                id="imageUrl"
                type="text"
                value={formData.imageUrl}
                onChange={handleInputChange}
                disabled={isUploading}
                className="w-full border-b-1 border-gray-300 outline-0"
              />
            </div>
          </div>
          
          {errors.imageUrl && <p className="text-red-500">{errors.imageUrl}</p>}
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-96 rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="font-bold">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full border-b-1 border-gray-300 outline-0"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="font-bold">
            Category
          </label>
          <input
            id="category"
            type="text"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full border-b-1 border-gray-300 outline-0"
          />
          {errors.category && <p className="text-red-500">{errors.category}</p>}
        </div>

        {/* Views */}
        <div>
          <label htmlFor="views" className="font-bold">
            Views
          </label>
          <input
            id="views"
            type="number"
            value={formData.views}
            onChange={handleInputChange}
            className="w-full border-b-1 border-gray-300 outline-0"
          />
        </div>

        {/* Active */}
        <div>
          <label htmlFor="active" className="font-bold">
            Active
          </label>
          <input
            id="active"
            type="checkbox"
            checked={formData.active}
            onChange={handleInputChange}
            className="ml-2"
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="font-bold">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full border-b-1 border-gray-300 outline-0"
          />
          {errors.tags && <p className="text-red-500">{errors.tags}</p>}
        </div>

        {/* Save Button */}
        {errors.form && <p className="text-red-500">{errors.form}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <button
          type="button"
          onClick={handleSave}
          disabled={isUploading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
        >
          {isUploading ? "Uploading..." : "Save"}
        </button>
      </form>
    </div>
  );
}
