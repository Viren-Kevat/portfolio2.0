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
        featured: true,
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
]

// All unique categories derived from posts
export const categories = ['All', ...new Set(posts.map(p => p.category))]