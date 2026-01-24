import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, 
  Plus, 
  Sparkles,
  Calendar,
  FileCode,
  Layout,
  Package,
  Download,
  Trash2,
  MoreVertical,
  Rocket,
  Clock,
  CheckCircle
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { PageTransition } from "@/components/animations/PageTransition";
import { ParticleField, FloatingOrbs } from "@/components/animations/ParticleField";

interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  status: string;
  type: string | null;
}

const StatCard = ({ value, label, color, icon: Icon, delay }: { 
  value: number; 
  label: string; 
  color: string;
  icon: any;
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="p-6 glass-panel text-center group hover:border-primary/50 transition-all">
        <motion.div
          className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${color} mb-3`}
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="h-6 w-6 text-white" />
        </motion.div>
        <motion.div 
          className={`text-3xl font-bold mb-1 bg-gradient-to-r ${color} bg-clip-text text-transparent`}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.2 }}
        >
          {value}
        </motion.div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </Card>
    </motion.div>
  );
};

const ProjectCard = ({ project, index, onDelete }: { project: Project; index: number; onDelete: () => void }) => {
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

  const statusColors = {
    completed: "from-green-500 to-emerald-500",
    "in-progress": "from-yellow-500 to-amber-500",
    pending: "from-blue-500 to-cyan-500",
  };

  const gradient = statusColors[project.status as keyof typeof statusColors] || statusColors.pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="p-6 glass-panel h-full relative overflow-hidden border-border/50 group">
          {/* Spotlight effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.15), transparent 50%)`,
            }}
          />

          {/* Gradient blob */}
          <motion.div
            className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} blur-3xl pointer-events-none`}
            animate={{
              opacity: isHovered ? 0.3 : 0.1,
              scale: isHovered ? 1.3 : 1,
            }}
            transition={{ duration: 0.4 }}
          />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div 
                  className={`p-2 rounded-lg bg-gradient-to-br ${gradient}`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <FolderOpen className="h-6 w-6 text-white" />
                </motion.div>
                <Badge 
                  variant={project.status === 'completed' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {project.status}
                </Badge>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            {/* Title */}
            <motion.h3 
              className="text-xl font-bold mb-2 line-clamp-1 transition-colors"
              animate={{ color: isHovered ? "hsl(var(--primary-glow))" : "hsl(var(--foreground))" }}
            >
              {project.name}
            </motion.h3>

            {/* Date */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {[
                { icon: FileCode, label: "Scripts" },
                { icon: Layout, label: "UI" },
                { icon: Package, label: "Assets" },
              ].map((tag, i) => (
                <motion.div
                  key={tag.label}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-muted/30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.1)" }}
                >
                  <tag.icon className="h-3 w-3" />
                  <span>{tag.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-border/50">
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="sm" variant="outline" className="w-full gap-2 group/btn">
                  <Download className="h-4 w-4 group-hover/btn:animate-bounce" />
                  Export
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" variant="ghost" className="gap-2 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Bottom accent */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: "left" }}
          />
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default function Projects() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const createNewProject = () => {
    navigate("/chat");
    toast.info("Start a chat to create a new project!");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background overflow-hidden">
        <Navigation />
        
        <div className="container mx-auto px-4 pt-24 pb-12 relative">
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <ParticleField particleCount={30} />
            <FloatingOrbs />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <motion.div 
              className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <motion.div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FolderOpen className="h-4 w-4 text-primary-glow" />
                  </motion.div>
                  <span className="text-sm text-muted-foreground">Your Work</span>
                </motion.div>
                
                <motion.h1 
                  className="text-5xl md:text-6xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
                    Projects
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Manage all your AI-generated game projects
                </motion.p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="gap-2 group relative overflow-hidden" onClick={createNewProject}>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                  <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform relative z-10" />
                  <span className="relative z-10">New Project</span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard 
                value={projects.length} 
                label="Total Projects" 
                color="from-primary to-primary-glow"
                icon={Rocket}
                delay={0.3}
              />
              <StatCard 
                value={projects.filter(p => p.status === 'completed').length} 
                label="Completed" 
                color="from-green-500 to-emerald-500"
                icon={CheckCircle}
                delay={0.4}
              />
              <StatCard 
                value={projects.filter(p => p.status === 'in-progress').length} 
                label="In Progress" 
                color="from-yellow-500 to-amber-500"
                icon={Clock}
                delay={0.5}
              />
              <StatCard 
                value={projects.filter(p => p.created_at > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()).length} 
                label="This Week" 
                color="from-blue-500 to-cyan-500"
                icon={Sparkles}
                delay={0.6}
              />
            </div>

            {/* Projects Grid */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  className="flex items-center justify-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div 
                    className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              ) : projects.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-12 glass-panel text-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FolderOpen className="h-20 w-20 mx-auto mb-6 text-muted-foreground opacity-50" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">No Projects Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start a chat with NexusAI to create your first game project
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="lg" className="gap-2" onClick={createNewProject}>
                        <Plus className="h-5 w-5" />
                        Create Your First Project
                      </Button>
                    </motion.div>
                  </Card>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, index) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      index={index}
                      onDelete={() => {}}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
