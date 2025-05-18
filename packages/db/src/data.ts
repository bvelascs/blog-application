export type Post = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  date: Date;
  category: string;
  views: number;
  likes: number;
  tags: string;
  active: boolean;
};

type like = {
  postId: number;
  userIP: string;
  Post: Post;
}

const content = `
  # Title 1

  Illo **sint voluptas**. Error voluptates culpa eligendi. 
  Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
  Sed exercitationem placeat consectetur nulla deserunt vel 
  iusto corrupti dicta laboris incididunt.

  ## Subtitle 1

  Illo sint *voluptas*. Error voluptates culpa eligendi. 
  Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
  Sed exercitationem placeat consectetur nulla deserunt vel 
  iusto corrupti dicta laboris incididunt.
`;

const description = `Illo sint voluptas. Error voluptates culpa eligendi. 
Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
Sed exercitationem placeat consectetur nulla deserunt vel 
iusto corrupti dicta laboris incididunt.`;

export const posts: Post[] = [
  {
    id: 1,
    title: "Boost your conversion rate",
    urlId: "boost-your-conversion-rate",
    description,
    content: content + " ... post1",
    imageUrl:
      "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: new Date("Apr 18, 2022"),
    category: "Node",
    tags: "Back-End,Databases",
    views: 320,
    likes: 3,
    active: true,
  },
  {
    id: 2,
    title: "Better front ends with Fatboy Slim",
    urlId: "better-front-ends-with-fatboy-slim",
    description: `Illo sint voluptas. Error voluptates culpa eligendi. 
       Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
       Sed exercitationem placeat consectetur nulla deserunt vel 
       iusto corrupti dicta laboris incididunt.`,
    content: content + " ... post2",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661342428515-5ca8cee4385a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3",
    date: new Date("Mar 16, 2020"),
    category: "React",
    tags: "Front-End,Optimisation",
    views: 10,
    likes: 1,
    active: true,
  },
  {
    id: 3,
    title: "No front end framework is the best",
    urlId: "no-front-end-framework-is-the-best",
    description: `Illo sint voluptas. Error voluptates culpa eligendi. 
       Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
       Sed exercitationem placeat consectetur nulla deserunt vel 
       iusto corrupti dicta laboris incididunt.`,
    content: content + " ... post3",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661517706036-a48d5fc8f2f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    date: new Date("Dec 16, 2024"),
    category: "React",
    tags: "Front-End,Dev Tools",
    views: 22,
    likes: 2,
    active: true,
  },  {
    id: 4,
    title: "Visual Basic is the future",
    urlId: "visual-basic-is-the-future",
    description: `Illo sint voluptas. Error voluptates culpa eligendi. 
       Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
       Sed exercitationem placeat consectetur nulla deserunt vel 
       iusto corrupti dicta laboris incididunt.`,    content: content + " ... post4",
    imageUrl: "https://m.media-amazon.com/images/I/51NqEfmmBTL.jpg",
    date: new Date("Dec 16, 2012"),
    category: "Mongo",
    tags: "Programming,Mainframes",
    views: 22,
    likes: 1,
    active: false,
  },  {
    id: 5,
    title: "Mastering TypeScript: Advanced Patterns",
    urlId: "mastering-typescript-advanced-patterns",
    description: `Take your TypeScript skills to the next level with advanced design patterns, type manipulations, and performance optimization techniques that will transform your codebase.`,
    content: content + " ... TypeScript advanced techniques",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=870&auto=format&fit=crop",
    date: new Date("Feb 12, 2025"),
    category: "TypeScript",
    tags: "JavaScript,Programming,Web Development",
    views: 302,
    likes: 28,
    active: true,
  },  {
    id: 6,
    title: "Sustainable Web Design: Reducing Carbon Footprint",
    urlId: "sustainable-web-design-reducing-carbon-footprint",
    description: `Learn how to create eco-friendly websites by optimizing images, implementing efficient coding practices, and choosing green hosting providers to minimize environmental impact.`,
    content: content + " ... Green web design principles",
    imageUrl: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?q=80&w=870&auto=format&fit=crop",
    date: new Date("Mar 05, 2025"),
    category: "Web Design",
    tags: "Sustainability,Performance,Best Practices",
    views: 185,
    likes: 19,
    active: true,
  },  {
    id: 7,
    title: "Building Accessible Web Applications",
    urlId: "building-accessible-web-applications",
    description: `Comprehensive guide to creating inclusive digital experiences. Learn practical techniques for implementing WCAG guidelines and ensuring your applications are usable by everyone.`,
    content: content + " ... Accessibility best practices",
    imageUrl: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?q=80&w=870&auto=format&fit=crop",
    date: new Date("Apr 10, 2025"),
    category: "Accessibility",
    tags: "Inclusive Design,UX,HTML",
    views: 210,
    likes: 24,
    active: true,
  },  {
    id: 8,
    title: "Microservices vs. Monoliths: Choosing the Right Architecture",
    urlId: "microservices-vs-monoliths-choosing-the-right-architecture",
    description: `An in-depth comparison of architectural approaches for modern applications. Understand the trade-offs, implementation challenges, and scenarios where each pattern shines.`,
    content: content + " ... Architecture comparison",
    imageUrl: "https://images.unsplash.com/photo-1603575448878-868a20723f5d?q=80&w=870&auto=format&fit=crop",
    date: new Date("Apr 22, 2025"),
    category: "Architecture",
    tags: "Microservices,System Design,Backend",
    views: 378,
    likes: 31,
    active: true,
  },  {
    id: 9,
    title: "WebAssembly: The Future of Web Performance",
    urlId: "webassembly-the-future-of-web-performance",
    description: `Discover how WebAssembly is revolutionizing browser-based applications by enabling near-native performance. Learn how to integrate Wasm modules into your JavaScript applications.`,
    content: content + " ... WebAssembly tutorial",
    imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=870&auto=format&fit=crop",
    date: new Date("May 02, 2025"),
    category: "Performance",
    tags: "WebAssembly,JavaScript,Optimization",
    views: 245,
    likes: 22,
    active: true,
  },
];
