import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "Getting Started with AI Game Development",
    excerpt: "Learn how to create your first Roblox game using NexusAI's powerful AI tools. This comprehensive guide will walk you through every step.",
    author: "NexusAI Team",
    date: "2024-01-15",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=400&fit=crop",
  },
  {
    id: 2,
    title: "10 Tips for Better AI Prompts",
    excerpt: "Maximize your results by learning how to write effective prompts that help our AI understand your vision better.",
    author: "NexusAI Team",
    date: "2024-01-10",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Understanding the Credit System",
    excerpt: "A deep dive into how credits work, how to earn them, and how to make the most of your NexusAI experience.",
    author: "NexusAI Team",
    date: "2024-01-05",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 gradient-text">NexusAI Blog</h1>
            <p className="text-xl text-muted-foreground">
              Tips, tutorials, and updates from the NexusAI team
            </p>
          </div>

          <div className="grid gap-8">
            {blogPosts.map((post, index) => (
              <article
                key={post.id}
                className="glass-panel overflow-hidden hover-glow animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-4 hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-lg text-muted-foreground mb-6">
                      {post.excerpt}
                    </p>
                    
                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                    >
                      Read More
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground text-lg">
              More articles coming soon. Stay tuned!
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
