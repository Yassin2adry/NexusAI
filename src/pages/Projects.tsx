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
  MoreVertical
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  status: string;
  type: string | null;
}

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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-12 flex items-center justify-between animate-fade-in">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-4">
                <FolderOpen className="h-4 w-4 text-primary-glow" />
                <span className="text-sm text-muted-foreground">Your Work</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
                Projects
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage all your AI-generated game projects
              </p>
            </div>
            <Button size="lg" className="gap-2" onClick={createNewProject}>
              <Plus className="h-5 w-5" />
              New Project
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
            <Card className="p-6 glass-panel text-center">
              <div className="text-3xl font-bold text-primary-glow mb-1">{projects.length}</div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
            </Card>
            <Card className="p-6 glass-panel text-center">
              <div className="text-3xl font-bold text-green-500 mb-1">
                {projects.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </Card>
            <Card className="p-6 glass-panel text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-1">
                {projects.filter(p => p.status === 'in-progress').length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </Card>
            <Card className="p-6 glass-panel text-center">
              <div className="text-3xl font-bold text-blue-500 mb-1">
                {projects.filter(p => p.created_at > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()).length}
              </div>
              <div className="text-sm text-muted-foreground">This Week</div>
            </Card>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <Card className="p-12 glass-panel text-center animate-fade-in">
              <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-2xl font-bold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start a chat with NexusAI to create your first game project
              </p>
              <Button size="lg" className="gap-2" onClick={createNewProject}>
                <Plus className="h-5 w-5" />
                Create Your First Project
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {projects.map((project) => (
                <Card key={project.id} className="p-6 glass-panel hover-glow transition-all hover:scale-105 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FolderOpen className="h-6 w-6 text-primary-glow" />
                      </div>
                      <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                    <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary-glow transition-colors line-clamp-1">
                    {project.name}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-muted/30">
                      <FileCode className="h-3 w-3" />
                      <span>Scripts</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-muted/30">
                      <Layout className="h-3 w-3" />
                      <span>UI</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-muted/30">
                      <Package className="h-3 w-3" />
                      <span>Assets</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border/50">
                    <Button size="sm" variant="outline" className="flex-1 gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                    <Button size="sm" variant="ghost" className="gap-2 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
