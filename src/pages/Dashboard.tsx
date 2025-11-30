import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FolderOpen, Clock, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  type: string | null;
  updated_at: string;
  status: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [credits, setCredits] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchCredits();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast.error("Failed to load projects");
      console.error("Error fetching projects:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchCredits = async () => {
    try {
      const { data, error } = await supabase
        .from("credits")
        .select("amount")
        .single();

      if (error) throw error;
      setCredits(data?.amount || 0);
    } catch (error: any) {
      console.error("Error fetching credits:", error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Projects</h1>
            <p className="text-muted-foreground">Manage your AI-generated games</p>
          </div>
          
          <Link to="/workspace">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Projects</p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>
          
          <Card className="p-6 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Credits</p>
                <p className="text-2xl font-bold">{credits}</p>
              </div>
              <Zap className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>
          
          <Card className="p-6 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Activity</p>
                <p className="text-2xl font-bold">
                  {projects.length > 0 ? formatTimeAgo(projects[0].updated_at) : "-"}
                </p>
              </div>
              <Clock className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
          
          {projects.length === 0 ? (
            <Card className="p-12 border-border text-center">
              <p className="text-muted-foreground mb-4">No projects yet</p>
              <Link to="/workspace">
                <Button>Create Your First Project</Button>
              </Link>
            </Card>
          ) : (
            projects.map((project) => (
              <Link key={project.id} to={`/workspace/${project.id}`}>
                <Card className="p-5 border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded bg-primary/10">
                        <FolderOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.type || "Game"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-muted-foreground mb-1">Modified</p>
                        <p className="text-sm">{formatTimeAgo(project.updated_at)}</p>
                      </div>
                      
                      <div className={`px-3 py-1 rounded text-xs font-medium ${
                        project.status === "complete" 
                          ? "bg-primary/10 text-primary" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {project.status === "complete" ? "Complete" : "In Progress"}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
