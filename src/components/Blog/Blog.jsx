import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Clock, Tag } from 'lucide-react'
import { useCursor } from '../../context/CursorContext'
import { posts, categories } from '../../data/posts'
import styles from './Blog.module.scss'

// ─── BLOG CARD ──────────────────────────────────────────
// Each post renders as a glass card with staggered reveal
const BlogCard = ({ post, index }) => {
    const { setCursorType } = useCursor()
    const ref = useRef(null)

    // useInView fires the animation when card enters viewport
    // margin: '-80px' means it triggers 80px before the element is fully visible
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <motion.article
            ref={ref}
            className={`${styles.card} ${post.featured ? styles.cardFeatured : ''}`}
            // staggered reveal — each card delays by its index
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
            onMouseEnter={() => setCursorType('hover')}
            onMouseLeave={() => setCursorType('default')}
        >
            {/* featured badge */}
            {post.featured && (
                <span className={styles.featuredBadge}>Featured</span>
            )}

            {/* card top row — category + arrow icon */}
            <div className={styles.cardTop}>
                <span className={styles.category}>
                    <Tag size={10} />
                    {post.category}
                </span>
                <motion.div
                    className={styles.arrowWrap}
                    whileHover={{ x: 3, y: -3 }}
                    transition={{ duration: 0.2 }}
                >
                    <ArrowUpRight size={18} />
                </motion.div>
            </div>

            {/* post number — ghost text behind */}
            <span className={styles.postNum}>{post.id}</span>

            {/* title + excerpt */}
            <div className={styles.cardBody}>
                <h3 className={styles.title}>{post.title}</h3>
                <p className={styles.excerpt}>{post.excerpt}</p>
            </div>

            {/* tags */}
            <div className={styles.tags}>
                {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                ))}
            </div>

            {/* bottom meta — date + read time */}
            <div className={styles.cardMeta}>
                <span className={styles.date}>{post.date}</span>
                <span className={styles.readTime}>
                    <Clock size={11} />
                    {post.readTime}
                </span>
            </div>

            {/* hover glow overlay */}
            <div className={styles.cardGlow} />
        </motion.article>
    )
}

// ─── MAIN BLOG COMPONENT ────────────────────────────────
const Blog = () => {
    const { setCursorType } = useCursor()
    const [activeCategory, setActiveCategory] = useState('All')
    const sectionRef = useRef(null)
    const headingRef = useRef(null)
    const headingInView = useInView(headingRef, { once: true, margin: '-100px' })

    // filter posts by selected category
    // 'All' shows everything, else filter by matching category string
    const filtered = activeCategory === 'All'
        ? posts
        : posts.filter(p => p.category === activeCategory)

    return (
        <section className={styles.blog} id="blog" ref={sectionRef}>

            {/* ── BACKGROUND DECORATION ─────────────── */}
            <div className={styles.bgOrb1} />
            <div className={styles.bgOrb2} />

            {/* ── HEADING ───────────────────────────── */}
            <div className={styles.headingWrap} ref={headingRef}>

                <motion.span
                    className={styles.label}
                    initial={{ opacity: 0 }}
                    animate={headingInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    // thoughts & learnings
                </motion.span>

                {/* two-line editorial heading */}
                <div className={styles.headingRow}>
                    <motion.h2
                        className={styles.heading}
                        initial={{ opacity: 0, y: 50 }}
                        animate={headingInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        WORDS I'VE
                        <br />
                        <span className={styles.headingAccent}>WRITTEN</span>
                    </motion.h2>

                    {/* right side — subtext + post count */}
                    <motion.div
                        className={styles.headingMeta}
                        initial={{ opacity: 0, x: 30 }}
                        animate={headingInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        <p className={styles.headingDesc}>
                            Raw notes from building, breaking, and learning
                            things the hard way.
                        </p>
                        <span className={styles.postCount}>
                            {posts.length} posts
                        </span>
                    </motion.div>
                </div>

                {/* ── CATEGORY FILTER PILLS ─────────── */}
                {/* AnimatePresence lets the active pill animate in/out */}
                <motion.div
                    className={styles.filters}
                    initial={{ opacity: 0, y: 20 }}
                    animate={headingInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
                            onClick={() => setActiveCategory(cat)}
                            onMouseEnter={() => setCursorType('hover')}
                            onMouseLeave={() => setCursorType('default')}
                        >
                            {/* sliding background pill for active state */}
                            {activeCategory === cat && (
                                <motion.span
                                    className={styles.filterPill}
                                    layoutId="activePill"  // framer-motion shared layout animation
                                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                />
                            )}
                            <span className={styles.filterLabel}>{cat}</span>
                        </button>
                    ))}
                </motion.div>
            </div>

            {/* ── CARD GRID ─────────────────────────── */}
            {/* AnimatePresence handles cards entering/leaving when filter changes */}
            <div className={styles.grid}>
                <AnimatePresence mode="popLayout">
                    {filtered.map((post, i) => (
                        <BlogCard key={post.id} post={post} index={i} />
                    ))}
                </AnimatePresence>
            </div>

            {/* ── BOTTOM CTA ────────────────────────── */}
            <motion.div
                className={styles.bottomCta}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7 }}
            >
                <span className={styles.ctaLabel}>// more coming soon</span>
                <p className={styles.ctaText}>
                    I write when I learn something worth sharing.
                </p>
            </motion.div>

        </section>
    )
}

export default Blog