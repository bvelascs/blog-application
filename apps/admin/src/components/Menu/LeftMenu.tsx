import { posts } from "@repo/db/data";


export function LeftMenu() {
  const activePosts = posts.filter((post) => post.active);
  
  return (
    <div className="w-64 bg-white shadow-md">
      {/* Sidebar header with WSU branding */}
      <div className="p-4 bg-[#333f48] text-white">
        <h2 className="text-lg font-semibold">Blog Management</h2>
      </div>

      {/* Navigation menu */}
      <nav className="py-4">
        <div className="px-4 py-2">
          <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Main Navigation</h3>
        </div>
        <ul className="mt-2">
          <li>
            <a href="/" className="flex items-center px-4 py-3 text-[#333f48] hover:bg-[#f5f5f5] hover:text-[#a31631]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </a>
          </li>
          <li>
            <a href="/posts/create" className="flex items-center px-4 py-3 text-[#333f48] hover:bg-[#f5f5f5] hover:text-[#a31631]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Post
            </a>
          </li>
        </ul>
  
      </nav>
    </div>
  );
}
