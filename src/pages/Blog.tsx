import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Calendar, User, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { PageTransition } from "@/components/animations/PageTransition";
import { ParticleField, FloatingOrbs } from "@/components/animations/ParticleField";
import { Card } from "@/components/ui/card";

const blogPosts = [
  {
    id: 1,
    title: "Getting Started with AI Game Development",
    excerpt: "Learn how to create your first Roblox game using NexusAI's powerful AI tools. This comprehensive guide will walk you through every step.",
    author: "NexusAI Team",
    date: "2024-01-15",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=400&fit=crop",
    category: "Tutorial",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "10 Tips for Better AI Prompts",
    excerpt: "Maximize your results by learning how to write effective prompts that help our AI understand your vision better.",
    author: "NexusAI Team",
    date: "2024-01-10",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    category: "Guide",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Understanding the Credit System",
    excerpt: "A deep dive into how credits work, how to earn them, and how to make the most of your NexusAI experience.",
    author: "NexusAI Team",
    date: "2024-01-05",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
    category: "Guide",
    gradient: "from-green-500 to-emerald-500",
  },
];

const BlogCard = ({ post, index }: { post: typeof blogPosts[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="glass-panel overflow-hidden relative group">
          {/* Spotlight effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
            style={{
              background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.1), transparent 50%)`,
            }}
          />

          <div className="md:flex">
            {/* Image */}
            <div className="md:w-1/3 relative overflow-hidden">
              <motion.img
                src={post.image}
                alt={post.title}
                className="w-full h-64 md:h-full object-cover"
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Category badge */}
              <motion.div
                className={`absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r ${post.gradient} text-white text-xs font-medium`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {post.category}
              </motion.div>

              {/* Overlay gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:bg-gradient-to-r"
                animate={{ opacity: isHovered ? 0.9 : 0.7 }}
              />
            </div>

            {/* Content */}
            <div className="md:w-2/3 p-8 relative z-10">
              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </motion.div>
              </div>
              
              {/* Title */}
              <motion.h2 
                className="text-2xl md:text-3xl font-bold mb-4 transition-colors"
                animate={{ color: isHovered ? "hsl(var(--primary-glow))" : "hsl(var(--foreground))" }}
              >
                {post.title}
              </motion.h2>
              
              {/* Excerpt */}
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {post.excerpt}
              </p>
              
              {/* CTA */}
              <Link
                to={`/blog/${post.id}`}
                className="inline-flex items-center gap-2 text-primary-glow font-semibold group/link"
              >
                <span>Read More</span>
                <motion.div
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Link>
            </div>
          </div>

          {/* Bottom accent */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${post.gradient}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: "left" }}
          />
        </Card>
      </motion.div>
    </motion.article>
  );
};

const Blog = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background overflow-hidden">
        <Navigation />
        
        <div className="container mx-auto px-4 py-24 relative">
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <ParticleField particleCount={25} />
            <FloatingOrbs />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Header */}
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BookOpen className="h-4 w-4 text-primary-glow" />
                </motion.div>
                <span className="text-sm text-muted-foreground">Latest Articles</span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
                  NexusAI Blog
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Tips, tutorials, and updates from the NexusAI team
              </motion.p>
            </motion.div>

            {/* Blog Posts */}
            <div className="space-y-8">
              {blogPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>

            {/* Coming Soon */}
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-8 glass-panel inline-block">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-8 w-8 text-primary-glow mx-auto mb-4" />
                </motion.div>
                <p className="text-muted-foreground text-lg">
                  More articles coming soon. Stay tuned!
                </p>
              </Card>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Blog;
