import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FolderOpen, Clock, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const mockProjects = [
  { id: 1, name: "Battle Royale Arena", type: "Battle Royale", lastModified: "2 hours ago", status: "complete" },
  { id: 2, name: "Horror Mansion Escape", type: "Horror", lastModified: "1 day ago", status: "complete" },
  { id: 3, name: "Tycoon Simulator", type: "Simulator", lastModified: "3 days ago", status: "in-progress" },
];

export default function Dashboard() {
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
                <p className="text-2xl font-bold">12</p>
              </div>
              <FolderOpen className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>
          
          <Card className="p-6 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Credits</p>
                <p className="text-2xl font-bold">450</p>
              </div>
              <Zap className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>
          
          <Card className="p-6 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Activity</p>
                <p className="text-2xl font-bold">2h ago</p>
              </div>
              <Clock className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
          {mockProjects.map((project) => (
            <Link key={project.id} to={`/workspace/${project.id}`}>
              <Card className="p-5 border-border hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded bg-primary/10">
                      <FolderOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-muted-foreground mb-1">Modified</p>
                      <p className="text-sm">{project.lastModified}</p>
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
          ))}
        </div>
      </div>
    </div>
  );
}
