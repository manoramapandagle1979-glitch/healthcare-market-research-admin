import type {
  Blog,
  BlogsResponse,
  BlogFilters,
  BlogResponse,
  BlogFormData,
  BlogTag,
  BlogTagsResponse,
  BlogCategory,
  BlogCategoriesResponse,
  BlogAuthor,
  BlogAuthorsResponse,
} from '@/lib/types/blogs';
import { WORDS_PER_MINUTE } from '@/lib/config/blogs';

// Sample HTML content for blog posts
const SAMPLE_BLOG_CONTENT_1 = `
<h2>Introduction</h2>
<p>The healthcare industry is witnessing a revolutionary transformation driven by <strong>artificial intelligence</strong>. From diagnostic imaging to drug discovery, AI is reshaping how healthcare providers deliver care and how patients experience treatment.</p>

<p>In this comprehensive guide, we'll explore the latest trends, real-world applications, and what the future holds for AI in healthcare.</p>

<h2>Key Applications of AI in Healthcare</h2>

<h3>1. Medical Imaging and Diagnostics</h3>
<p>AI-powered imaging analysis has shown remarkable accuracy in detecting diseases early. Machine learning algorithms can now identify patterns in X-rays, MRIs, and CT scans that might be missed by human eyes.</p>
<ul>
  <li>Cancer detection in mammograms with 94% accuracy</li>
  <li>Early identification of diabetic retinopathy</li>
  <li>Automated analysis of pathology slides</li>
</ul>

<h3>2. Drug Discovery and Development</h3>
<p>Traditional drug development takes years and billions of dollars. AI is accelerating this process by:</p>
<ul>
  <li>Analyzing molecular structures to predict drug efficacy</li>
  <li>Identifying potential drug candidates faster</li>
  <li>Optimizing clinical trial design and patient recruitment</li>
</ul>

<h3>3. Personalized Medicine</h3>
<p>AI enables treatment plans tailored to individual patients based on their genetic makeup, lifestyle, and medical history. This approach improves outcomes while reducing side effects.</p>

<h2>Challenges and Considerations</h2>
<p>While AI offers tremendous potential, several challenges need addressing:</p>
<ul>
  <li><strong>Data Privacy:</strong> Healthcare data is sensitive and requires robust protection</li>
  <li><strong>Regulatory Compliance:</strong> AI systems must meet FDA and other regulatory standards</li>
  <li><strong>Integration:</strong> Legacy healthcare systems can be difficult to modernize</li>
  <li><strong>Trust:</strong> Building clinician and patient trust in AI recommendations</li>
</ul>

<h2>Conclusion</h2>
<p>AI is not replacing healthcare professionals but empowering them with better tools. As technology advances and regulatory frameworks mature, we can expect AI to become an integral part of healthcare delivery, improving outcomes for patients worldwide.</p>
`;

const SAMPLE_BLOG_CONTENT_2 = `
<h2>The Telemedicine Revolution</h2>
<p>The COVID-19 pandemic accelerated telemedicine adoption by a decade. What was once a convenience has become a necessity, and healthcare providers are adapting to this new reality.</p>

<h2>Benefits of Telemedicine</h2>
<h3>For Patients</h3>
<ul>
  <li>Convenient access to healthcare from home</li>
  <li>Reduced travel time and costs</li>
  <li>Better access for rural communities</li>
  <li>Reduced exposure to illnesses in waiting rooms</li>
</ul>

<h3>For Providers</h3>
<ul>
  <li>Increased patient volume capacity</li>
  <li>Reduced no-show rates</li>
  <li>Better work-life balance options</li>
  <li>Expanded geographic reach</li>
</ul>

<h2>Implementing Telemedicine Successfully</h2>
<p>Organizations looking to implement or expand telemedicine should consider:</p>
<ol>
  <li>Choosing the right platform with HIPAA compliance</li>
  <li>Training staff on virtual care best practices</li>
  <li>Establishing clear protocols for virtual vs. in-person visits</li>
  <li>Ensuring reliable technical infrastructure</li>
</ol>

<h2>The Future of Virtual Care</h2>
<p>Telemedicine is evolving beyond video consultations. Emerging trends include:</p>
<ul>
  <li>Remote patient monitoring with wearable devices</li>
  <li>AI-powered symptom checkers and triage</li>
  <li>Virtual reality for physical therapy and mental health</li>
  <li>Integration with electronic health records</li>
</ul>

<p>The future of healthcare is hybrid, combining the best of in-person and virtual care to improve access, outcomes, and patient satisfaction.</p>
`;

const SAMPLE_BLOG_CONTENT_3 = `
<h2>Understanding Clinical Trials</h2>
<p>Clinical trials are essential for advancing medical knowledge and developing new treatments. Yet many people don't fully understand how they work or why they matter.</p>

<h2>The Four Phases of Clinical Trials</h2>

<h3>Phase I: Safety Testing</h3>
<p>The first phase tests a new treatment in a small group (20-80 people) to evaluate safety, dosage range, and side effects.</p>

<h3>Phase II: Efficacy Testing</h3>
<p>Phase II involves larger groups (100-300 people) to determine if the treatment works and further evaluate safety.</p>

<h3>Phase III: Large-Scale Testing</h3>
<p>This phase compares the new treatment against current standard treatments in large populations (1,000-3,000 people).</p>

<h3>Phase IV: Post-Marketing Surveillance</h3>
<p>After approval, ongoing monitoring tracks long-term effectiveness and safety in the general population.</p>

<h2>Who Can Participate?</h2>
<p>Each trial has specific eligibility criteria, but generally trials seek participants who:</p>
<ul>
  <li>Have the condition being studied</li>
  <li>Meet age and health requirements</li>
  <li>Haven't taken certain medications</li>
  <li>Are willing to follow the trial protocol</li>
</ul>

<h2>Benefits and Risks</h2>
<p>Participating in clinical trials offers potential benefits including access to new treatments, expert medical care, and contributing to medical advancement. However, participants should understand potential risks and that new treatments may have unknown side effects.</p>
`;

// Utility: Generate URL-friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Utility: Calculate reading time
function calculateReadingTime(htmlContent: string): number {
  const text = htmlContent.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / WORDS_PER_MINUTE);
}

// Mock Tags
const mockTags: BlogTag[] = [
  { id: 'tag-1', name: 'AI in Healthcare', slug: 'ai-in-healthcare' },
  { id: 'tag-2', name: 'Digital Health', slug: 'digital-health' },
  { id: 'tag-3', name: 'Telemedicine', slug: 'telemedicine' },
  { id: 'tag-4', name: 'Clinical Trials', slug: 'clinical-trials' },
  { id: 'tag-5', name: 'Medical Devices', slug: 'medical-devices' },
  { id: 'tag-6', name: 'Pharmaceuticals', slug: 'pharmaceuticals' },
  { id: 'tag-7', name: 'Biotechnology', slug: 'biotechnology' },
  { id: 'tag-8', name: 'Healthcare IT', slug: 'healthcare-it' },
  { id: 'tag-9', name: 'Patient Care', slug: 'patient-care' },
  { id: 'tag-10', name: 'Regulatory', slug: 'regulatory' },
  { id: 'tag-11', name: 'FDA', slug: 'fda' },
  { id: 'tag-12', name: 'Market Trends', slug: 'market-trends' },
];

// Mock Categories
const mockCategories: BlogCategory[] = [
  {
    id: 'cat-1',
    name: 'Industry News',
    slug: 'industry-news',
    description: 'Latest news from the healthcare industry',
    postCount: 5,
  },
  {
    id: 'cat-2',
    name: 'Market Analysis',
    slug: 'market-analysis',
    description: 'In-depth market analysis and reports',
    postCount: 3,
  },
  {
    id: 'cat-3',
    name: 'Research Insights',
    slug: 'research-insights',
    description: 'Insights from our research team',
    postCount: 4,
  },
  {
    id: 'cat-4',
    name: 'Technology Trends',
    slug: 'technology-trends',
    description: 'Emerging technology trends in healthcare',
    postCount: 6,
  },
  {
    id: 'cat-5',
    name: 'How-To Guides',
    slug: 'how-to-guides',
    description: 'Practical guides and tutorials',
    postCount: 2,
  },
  {
    id: 'cat-6',
    name: 'Case Studies',
    slug: 'case-studies',
    description: 'Real-world case studies',
    postCount: 2,
  },
  {
    id: 'cat-7',
    name: 'Opinion',
    slug: 'opinion',
    description: 'Expert opinions and commentary',
    postCount: 1,
  },
];

// Mock Authors
const mockAuthors: BlogAuthor[] = [
  {
    id: 'author-1',
    email: 'admin@example.com',
    name: 'Dr. Sarah Mitchell',
    bio: 'Healthcare industry analyst with 15+ years of experience in market research and strategic consulting.',
    avatar: '/avatars/sarah.jpg',
    socialLinks: {
      twitter: '@sarahmitchell',
      linkedin: 'in/sarah-mitchell-healthcare',
    },
  },
  {
    id: 'author-2',
    email: 'editor@example.com',
    name: 'James Chen',
    bio: 'Senior research analyst specializing in digital health and healthcare technology trends.',
    avatar: '/avatars/james.jpg',
    socialLinks: {
      linkedin: 'in/james-chen-research',
    },
  },
  {
    id: 'author-3',
    email: 'analyst@example.com',
    name: 'Emily Rodriguez',
    bio: 'Healthcare economist focused on market dynamics and industry forecasting.',
    avatar: '/avatars/emily.jpg',
    socialLinks: {
      twitter: '@emilyrodhealth',
      linkedin: 'in/emily-rodriguez-economist',
    },
  },
];

// Mock Blog Posts
const mockBlogs: Blog[] = [
  // Published Posts
  {
    id: 'blog-001',
    title: 'The Future of AI in Healthcare: A Comprehensive Guide',
    slug: 'future-of-ai-in-healthcare-comprehensive-guide',
    excerpt:
      'Explore how artificial intelligence is transforming healthcare, from diagnostics to drug discovery, and what it means for the future of medicine.',
    content: SAMPLE_BLOG_CONTENT_1,
    featuredImage: '/images/blog/ai-healthcare.jpg',
    category: 'Technology Trends',
    tags: [mockTags[0], mockTags[1], mockTags[7]],
    author: mockAuthors[0],
    status: 'published',
    publishDate: new Date('2024-12-20').toISOString(),
    readingTime: calculateReadingTime(SAMPLE_BLOG_CONTENT_1),
    viewCount: 1245,
    metadata: {
      metaTitle: 'The Future of AI in Healthcare | Comprehensive Guide 2024',
      metaDescription:
        'Discover how AI is revolutionizing healthcare through improved diagnostics, drug discovery, and personalized medicine.',
      keywords: ['AI healthcare', 'medical AI', 'healthcare technology', 'digital health'],
      ogImage: '/images/blog/ai-healthcare-og.jpg',
    },
    versions: [
      {
        id: 'v-blog-001-1',
        versionNumber: 1,
        summary: 'Initial publication',
        createdAt: new Date('2024-12-20').toISOString(),
        author: mockAuthors[0],
        content: SAMPLE_BLOG_CONTENT_1,
        title: 'The Future of AI in Healthcare: A Comprehensive Guide',
        excerpt: 'Explore how artificial intelligence is transforming healthcare.',
      },
    ],
    createdAt: new Date('2024-12-15').toISOString(),
    updatedAt: new Date('2024-12-20').toISOString(),
  },
  {
    id: 'blog-002',
    title: 'Telemedicine Best Practices: Implementing Virtual Care Successfully',
    slug: 'telemedicine-best-practices-implementing-virtual-care',
    excerpt:
      'Learn the key strategies for implementing telemedicine in your healthcare organization, from technology selection to staff training.',
    content: SAMPLE_BLOG_CONTENT_2,
    featuredImage: '/images/blog/telemedicine.jpg',
    category: 'How-To Guides',
    tags: [mockTags[2], mockTags[1], mockTags[8]],
    author: mockAuthors[1],
    status: 'published',
    publishDate: new Date('2024-12-18').toISOString(),
    readingTime: calculateReadingTime(SAMPLE_BLOG_CONTENT_2),
    viewCount: 892,
    metadata: {
      metaTitle: 'Telemedicine Best Practices | Virtual Care Implementation Guide',
      metaDescription:
        'A practical guide to implementing telemedicine in healthcare organizations, covering technology, training, and best practices.',
      keywords: ['telemedicine', 'virtual care', 'telehealth', 'healthcare technology'],
    },
    versions: [],
    createdAt: new Date('2024-12-12').toISOString(),
    updatedAt: new Date('2024-12-18').toISOString(),
  },
  {
    id: 'blog-003',
    title: "Understanding Clinical Trials: A Patient's Guide",
    slug: 'understanding-clinical-trials-patients-guide',
    excerpt:
      'Everything you need to know about clinical trials, including how they work, who can participate, and what to expect.',
    content: SAMPLE_BLOG_CONTENT_3,
    featuredImage: '/images/blog/clinical-trials.jpg',
    category: 'Research Insights',
    tags: [mockTags[3], mockTags[5], mockTags[9]],
    author: mockAuthors[2],
    status: 'published',
    publishDate: new Date('2024-12-15').toISOString(),
    readingTime: calculateReadingTime(SAMPLE_BLOG_CONTENT_3),
    viewCount: 678,
    metadata: {
      metaTitle: 'Understanding Clinical Trials | Patient Guide 2024',
      metaDescription:
        'A comprehensive guide to clinical trials for patients, covering phases, eligibility, benefits, and what to expect.',
      keywords: ['clinical trials', 'patient guide', 'drug development', 'pharmaceutical research'],
    },
    versions: [],
    createdAt: new Date('2024-12-10').toISOString(),
    updatedAt: new Date('2024-12-15').toISOString(),
  },
  {
    id: 'blog-004',
    title: 'Digital Health Market Update: Q4 2024 Trends',
    slug: 'digital-health-market-update-q4-2024-trends',
    excerpt:
      'A quarterly update on the digital health market, covering funding trends, key acquisitions, and emerging technologies.',
    content:
      '<h2>Q4 2024 Digital Health Overview</h2><p>The digital health sector continues to evolve rapidly...</p>',
    featuredImage: '/images/blog/digital-health-q4.jpg',
    category: 'Market Analysis',
    tags: [mockTags[1], mockTags[11], mockTags[7]],
    author: mockAuthors[0],
    status: 'published',
    publishDate: new Date('2024-12-10').toISOString(),
    readingTime: 8,
    viewCount: 1567,
    metadata: {
      metaTitle: 'Digital Health Market Update Q4 2024 | Market Trends',
      metaDescription:
        'Quarterly analysis of the digital health market with funding trends, acquisitions, and technology insights.',
      keywords: ['digital health', 'market trends', 'healthcare funding', 'health tech'],
    },
    versions: [],
    createdAt: new Date('2024-12-05').toISOString(),
    updatedAt: new Date('2024-12-10').toISOString(),
  },
  {
    id: 'blog-005',
    title: 'FDA Regulatory Updates: What Healthcare Companies Need to Know',
    slug: 'fda-regulatory-updates-healthcare-companies',
    excerpt:
      'Key FDA regulatory changes affecting medical devices, pharmaceuticals, and digital health products in 2024.',
    content:
      '<h2>Recent FDA Regulatory Changes</h2><p>The FDA has introduced several new guidance documents...</p>',
    featuredImage: '/images/blog/fda-updates.jpg',
    category: 'Industry News',
    tags: [mockTags[9], mockTags[10], mockTags[4]],
    author: mockAuthors[1],
    status: 'published',
    publishDate: new Date('2024-12-05').toISOString(),
    readingTime: 6,
    viewCount: 445,
    metadata: {
      metaTitle: 'FDA Regulatory Updates 2024 | Healthcare Compliance Guide',
      metaDescription:
        'Stay informed about the latest FDA regulatory updates affecting healthcare companies and medical products.',
      keywords: ['FDA', 'regulatory', 'compliance', 'medical devices', 'pharmaceuticals'],
    },
    versions: [],
    createdAt: new Date('2024-12-01').toISOString(),
    updatedAt: new Date('2024-12-05').toISOString(),
  },

  // In Review Posts
  {
    id: 'blog-006',
    title: 'Biotechnology Innovation: Gene Therapy Breakthroughs',
    slug: 'biotechnology-innovation-gene-therapy-breakthroughs',
    excerpt:
      'Examining recent breakthroughs in gene therapy and their potential impact on treating genetic diseases.',
    content:
      '<h2>Gene Therapy Revolution</h2><p>Gene therapy has made significant strides in recent years...</p>',
    featuredImage: '/images/blog/gene-therapy.jpg',
    category: 'Research Insights',
    tags: [mockTags[6], mockTags[5], mockTags[3]],
    author: mockAuthors[2],
    status: 'review',
    publishDate: new Date('2024-12-30').toISOString(),
    readingTime: 10,
    viewCount: 0,
    metadata: {
      metaTitle: 'Gene Therapy Breakthroughs 2024 | Biotechnology Innovation',
      metaDescription:
        'Explore the latest gene therapy breakthroughs and their potential to transform treatment of genetic diseases.',
      keywords: ['gene therapy', 'biotechnology', 'CRISPR', 'genetic diseases'],
    },
    versions: [],
    createdAt: new Date('2024-12-18').toISOString(),
    updatedAt: new Date('2024-12-22').toISOString(),
    reviewedBy: mockAuthors[0],
    reviewedAt: new Date('2024-12-22').toISOString(),
  },
  {
    id: 'blog-007',
    title: 'The Rise of Wearable Medical Devices',
    slug: 'rise-of-wearable-medical-devices',
    excerpt:
      'How wearable medical devices are transforming patient monitoring and preventive healthcare.',
    content:
      '<h2>Wearables in Healthcare</h2><p>Wearable medical devices are becoming increasingly sophisticated...</p>',
    category: 'Technology Trends',
    tags: [mockTags[4], mockTags[1], mockTags[8]],
    author: mockAuthors[1],
    status: 'review',
    publishDate: new Date('2025-01-05').toISOString(),
    readingTime: 7,
    viewCount: 0,
    metadata: {
      metaTitle: 'Wearable Medical Devices | Healthcare Technology Trends',
      metaDescription:
        'Discover how wearable medical devices are revolutionizing patient monitoring and preventive care.',
      keywords: ['wearables', 'medical devices', 'patient monitoring', 'digital health'],
    },
    versions: [],
    createdAt: new Date('2024-12-20').toISOString(),
    updatedAt: new Date('2024-12-23').toISOString(),
  },

  // Draft Posts
  {
    id: 'blog-008',
    title: 'Mental Health Tech: The Digital Therapeutics Landscape',
    slug: 'mental-health-tech-digital-therapeutics-landscape',
    excerpt:
      'An exploration of digital therapeutics for mental health, from apps to VR-based treatments.',
    content: '<h2>Draft: Mental Health Tech</h2><p>Content in progress...</p>',
    category: 'Technology Trends',
    tags: [mockTags[1], mockTags[8]],
    author: mockAuthors[0],
    status: 'draft',
    publishDate: new Date('2025-01-15').toISOString(),
    readingTime: 0,
    viewCount: 0,
    metadata: {},
    versions: [],
    createdAt: new Date('2024-12-21').toISOString(),
    updatedAt: new Date('2024-12-24').toISOString(),
  },
  {
    id: 'blog-009',
    title: 'Healthcare Data Analytics: Best Practices',
    slug: 'healthcare-data-analytics-best-practices',
    excerpt: 'Best practices for implementing data analytics in healthcare organizations.',
    content: '<h2>Draft: Data Analytics in Healthcare</h2><p>Content in progress...</p>',
    category: 'How-To Guides',
    tags: [mockTags[7], mockTags[1]],
    author: mockAuthors[2],
    status: 'draft',
    publishDate: new Date('2025-01-20').toISOString(),
    readingTime: 0,
    viewCount: 0,
    metadata: {},
    versions: [],
    createdAt: new Date('2024-12-19').toISOString(),
    updatedAt: new Date('2024-12-23').toISOString(),
  },
  {
    id: 'blog-010',
    title: 'Precision Medicine: Personalizing Patient Care',
    slug: 'precision-medicine-personalizing-patient-care',
    excerpt:
      'How precision medicine is enabling personalized treatment plans based on genetic profiles.',
    content: '<h2>Draft: Precision Medicine</h2><p>Content in progress...</p>',
    category: 'Research Insights',
    tags: [mockTags[6], mockTags[5]],
    author: mockAuthors[1],
    status: 'draft',
    publishDate: new Date('2025-02-01').toISOString(),
    readingTime: 0,
    viewCount: 0,
    metadata: {},
    versions: [],
    createdAt: new Date('2024-12-17').toISOString(),
    updatedAt: new Date('2024-12-22').toISOString(),
  },
];

// Mock API functions
export async function fetchBlogsMock(filters?: BlogFilters): Promise<BlogsResponse> {
  await new Promise(resolve => setTimeout(resolve, 600));

  let filtered = [...mockBlogs];

  // Apply filters
  if (filters?.status) {
    filtered = filtered.filter(b => b.status === filters.status);
  }
  if (filters?.category) {
    filtered = filtered.filter(b => b.category === filters.category);
  }
  if (filters?.tag) {
    filtered = filtered.filter(b =>
      b.tags.some(t => t.slug === filters.tag || t.name === filters.tag)
    );
  }
  if (filters?.authorId) {
    filtered = filtered.filter(b => b.author.id === filters.authorId);
  }
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      b =>
        b.title.toLowerCase().includes(search) ||
        b.excerpt.toLowerCase().includes(search) ||
        b.tags.some(t => t.name.toLowerCase().includes(search))
    );
  }

  // Sort by updatedAt (newest first)
  filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  // Pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const blogs = filtered.slice(start, end);

  return { blogs, total, page, limit, totalPages };
}

export async function fetchBlogByIdMock(id: string): Promise<BlogResponse> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const blog = mockBlogs.find(b => b.id === id);
  if (!blog) {
    throw new Error('Blog post not found');
  }

  return { blog };
}

export async function createBlogMock(data: BlogFormData): Promise<BlogResponse> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const author = mockAuthors.find(a => a.id === data.authorId) || mockAuthors[0];

  const newBlog: Blog = {
    id: `blog-${Date.now()}`,
    title: data.title,
    slug: generateSlug(data.title),
    excerpt: data.excerpt,
    content: data.content,
    featuredImage: data.featuredImage,
    category: data.category,
    tags: data.tags,
    author,
    status: data.status,
    publishDate: data.publishDate,
    readingTime: calculateReadingTime(data.content),
    viewCount: 0,
    metadata: data.metadata,
    versions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockBlogs.unshift(newBlog);
  return { blog: newBlog };
}

export async function updateBlogMock(
  id: string,
  data: Partial<BlogFormData>
): Promise<BlogResponse> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const index = mockBlogs.findIndex(b => b.id === id);
  if (index === -1) {
    throw new Error('Blog post not found');
  }

  const existingBlog = mockBlogs[index];
  const author = data.authorId
    ? mockAuthors.find(a => a.id === data.authorId) || existingBlog.author
    : existingBlog.author;

  const updated: Blog = {
    ...existingBlog,
    ...data,
    author,
    readingTime: data.content ? calculateReadingTime(data.content) : existingBlog.readingTime,
    updatedAt: new Date().toISOString(),
  };

  // Add version if status changed to published
  if (data.status === 'published' && existingBlog.status !== 'published') {
    const newVersion = {
      id: `v-${Date.now()}`,
      versionNumber: (updated.versions?.length || 0) + 1,
      summary: 'Published blog post',
      createdAt: new Date().toISOString(),
      author: updated.author,
      content: updated.content,
      title: updated.title,
      excerpt: updated.excerpt,
    };
    updated.versions = [...(updated.versions || []), newVersion];
    updated.publishDate = new Date().toISOString();
  }

  mockBlogs[index] = updated;
  return { blog: updated };
}

export async function deleteBlogMock(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const index = mockBlogs.findIndex(b => b.id === id);
  if (index === -1) {
    throw new Error('Blog post not found');
  }

  mockBlogs.splice(index, 1);
}

// Tag operations
export async function fetchTagsMock(): Promise<BlogTagsResponse> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { tags: mockTags, total: mockTags.length };
}

export async function createTagMock(name: string): Promise<{ tag: BlogTag }> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const newTag: BlogTag = {
    id: `tag-${Date.now()}`,
    name,
    slug: generateSlug(name),
  };

  mockTags.push(newTag);
  return { tag: newTag };
}

export async function deleteTagMock(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = mockTags.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error('Tag not found');
  }

  mockTags.splice(index, 1);
}

// Category operations
export async function fetchCategoriesMock(): Promise<BlogCategoriesResponse> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { categories: mockCategories, total: mockCategories.length };
}

// Author operations
export async function fetchAuthorsMock(): Promise<BlogAuthorsResponse> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { authors: mockAuthors, total: mockAuthors.length };
}
