// src/data/posts.js
// Blog posts data — add real markdown content later

export const posts = [
    {
        id: '01',
        slug: 'why-i-chose-mern',
        title: 'Why I Chose the MERN Stack as a Beginner',
        excerpt:
            'Everyone told me to start simple. I started with MongoDB, Express, React, and Node instead — and it was the best chaotic decision I ever made.',
        category: 'Dev Journey',
        tags: ['MERN', 'React', 'Node.js', 'Beginners'],
        date: 'Jan 12, 2025',
        readTime: '5 min read',
        featured: false,
    },
    {
        id: '02',
        slug: 'css-vs-scss-in-real-projects',
        title: 'CSS vs SCSS — What I Learned Building Real Projects',
        excerpt:
            'Variables, mixins, nesting — SCSS sounds like overkill until you\'re maintaining 3000 lines of styles and need to change one color token globally.',
        category: 'Styling',
        tags: ['SCSS', 'CSS', 'Frontend'],
        date: 'Feb 3, 2025',
        readTime: '4 min read',
        featured: false,
    },
    {
        id: '03',
        slug: 'jwt-auth-from-scratch',
        title: 'Building JWT Auth from Scratch in Express',
        excerpt:
            'Tokens, refresh flows, middleware — no library magic, just raw Express and a deep understanding of how authentication actually works.',
        category: 'Backend',
        tags: ['JWT', 'Express.js', 'Node.js', 'Auth'],
        date: 'Mar 15, 2025',
        readTime: '7 min read',
        featured: false,
    },
    {
        id: '04',
        slug: 'framer-motion-micro-interactions',
        title: 'Micro-Interactions That Actually Feel Good',
        excerpt:
            'The difference between a good UI and a great one is 200ms. Here\'s how I use Framer Motion to make every click, hover, and transition feel intentional.',
        category: 'Animation',
        tags: ['Framer Motion', 'React', 'UX'],
        date: 'Apr 2, 2025',
        readTime: '6 min read',
        featured: false,
    },
    {
        id: '05',
        slug: 'vibe-coding-is-not-wrong',
        title: 'Vibe Coding Isn\'t Wrong — If You Actually Understand the Codebase',
        excerpt:
            'Everyone\'s hating on vibe coding like it\'s some crime. But when you genuinely understand the architecture, the patterns, and the why behind every line — coding by instinct isn\'t reckless, it\'s earned.',
        category: 'Dev Culture',
        tags: ['Vibe Coding', 'Developer Mindset', 'Productivity'],
        date: 'Apr 18, 2026',
        readTime: '5 min read',
        featured: true,
    },
    {
        id: '06',
        slug: 'adaptation-is-the-key',
        title: 'Adaptation Is the Key to Surviving the New World of Tech',
        excerpt:
            'The tools change every six months. The frameworks die and resurrect. The only developers who thrive aren\'t the ones who memorise syntax — they\'re the ones who adapt without losing their core.',
        category: 'Mindset',
        tags: ['Adaptation', 'Tech Industry', 'Growth', 'Career'],
        date: 'Jun 5, 2026',
        readTime: '6 min read',
        featured: false,
    },
    {
        id: '07',
        slug: 'why-i-dont-fear-ai',
        title: 'I Don\'t Fear AI — Because I Know the Fundamentals',
        excerpt:
            'AI can autocomplete your code. It can scaffold your project. But it can\'t replace the developer who knows why a hash map is O(1), when to normalize a database, or how the event loop actually works.',
        category: 'Opinion',
        tags: ['AI', 'Fundamentals', 'Developer Growth', 'Future'],
        date: 'Jul 22, 2026',
        readTime: '7 min read',
        featured: false,
    },
    {
        id: '08',
        slug: 'java-the-language-that-teaches-you-coding',
        title: 'Java Taught Me How to Actually Think Like a Programmer',
        excerpt:
            'Not the coolest language. Not the trendiest. But Java forced me to understand OOP, memory, types, and structure in a way no shortcut-friendly language ever could. It\'s the bedrock of real engineering.',
        category: 'Dev Journey',
        tags: ['Java', 'OOP', 'Programming Fundamentals', 'Learning'],
        date: 'Sep 10, 2026',
        readTime: '6 min read',
        featured: false,
    },
]

// All unique categories derived from posts
export const categories = ['All', ...new Set(posts.map(p => p.category))]