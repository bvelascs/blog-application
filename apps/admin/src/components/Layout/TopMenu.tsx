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
    // Container with right-aligned content
    <div className="flex justify-end">
      {/* Inner container for menu items with spacing */}
      <div className="flex items-center gap-x-6">
        {/* Theme toggle switch component */}
        <ThemeSwitch />
      </div>
    </div>
  );
}
