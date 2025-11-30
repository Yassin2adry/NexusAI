import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Sparkles, Zap, Users, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 gradient-text">About NexusAI</h1>
            <p className="text-xl text-muted-foreground">
              Revolutionizing Roblox game development with AI
            </p>
          </div>

          <div className="glass-panel p-8 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              NexusAI is dedicated to democratizing game development on Roblox. We believe that everyone should have the power to bring their game ideas to life, regardless of their coding experience.
            </p>
            <p className="text-lg text-muted-foreground">
              By leveraging cutting-edge artificial intelligence, we provide creators with tools that transform simple prompts into fully functional Roblox games, complete with scripts, UI components, and assets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously push the boundaries of AI technology to provide the most advanced and intuitive game development tools for the Roblox platform.
              </p>
            </div>

            <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Community</h3>
              <p className="text-muted-foreground">
                Our thriving community of creators shares ideas, provides feedback, and helps shape the future of AI-powered game development.
              </p>
            </div>

            <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Award className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Quality</h3>
              <p className="text-muted-foreground">
                Every feature we build is designed with quality and user experience in mind, ensuring reliable and professional results.
              </p>
            </div>

            <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Creativity</h3>
              <p className="text-muted-foreground">
                We empower creators to focus on their vision while our AI handles the technical complexity of game development.
              </p>
            </div>
          </div>

          <div className="glass-panel p-8 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Founded by passionate game developers and AI researchers, NexusAI was born from the vision of making game creation accessible to everyone. We recognized the steep learning curve in traditional game development and set out to change that.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              Through months of research and development, we created a platform that understands natural language and translates it into working Roblox games. Our AI has been trained on thousands of successful Roblox games, learning the patterns and best practices that make games engaging and fun.
            </p>
            <p className="text-lg text-muted-foreground">
              Today, NexusAI serves creators worldwide, helping them turn their imagination into reality. We're just getting started on our mission to revolutionize game development.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
