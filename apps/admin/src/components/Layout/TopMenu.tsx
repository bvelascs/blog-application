"use client"; // Marks this component as client-side rendered in Next.js

// Import required dependencies and components
import { useRouter } from "next/navigation";
import ThemeSwitch from "../Themes/ThemeSwitcher";
import { ChangeEvent } from "react";

// Utility function to prevent rapid-fire function calls
// Generic type T ensures type safety for the debounced function
function debounce<T extends (...args: any[]) => any>(fn: T, delay = 100) {
  let timeoutId: any;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId); // Cancel previous timeout
    timeoutId = setTimeout(() => fn.apply(this, args), delay); // Set new timeout
  };
}

// TopMenu component that accepts an optional search query prop
export function TopMenu({ query }: { query?: string }) {
  // Initialize Next.js router for programmatic navigation
  const router = useRouter();

  // Debounced search handler to limit route updates while typing
  // Waits for user to stop typing before updating the URL
  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      router.push(`/search?q=${search}`); // Navigate to search results page
    },
  );

  // Event handler for search input changes
  // Calls the debounced search function
  function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    handleSearch(e);
  }
  // Render the top menu component
  return (
    // Container with flexible content
    <div className="flex justify-between items-center mb-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-[#333f48]">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Manage your blog content</p>
      </div>
      
      {/* Right-aligned actions */}
      <div className="flex items-center gap-x-6">
        {/* Search box */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input 
            type="search" 
            onChange={onChangeHandler}
            placeholder="Search posts..."
            defaultValue={query}
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-[#a31631] focus:border-[#a31631]" 
          />
        </div>
        
        {/* Theme toggle switch component */}
        <ThemeSwitch />
      </div>
    </div>
  );
}
