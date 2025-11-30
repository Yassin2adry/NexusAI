import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FolderOpen, Clock, Download } from "lucide-react";
import { Link } from "react-router-dom";

const mockProjects = [
  {
    id: 1,
    name: "Battle Royale Arena",
    type: "Battle Royale",
    lastModified: "2 hours ago",
    status: "complete",
  },
  {
    id: 2,
    name: "Horror Mansion Escape",
    type: "Horror",
    lastModified: "1 day ago",
    status: "complete",
  },
  {
    id: 3,
    name: "Simulator Empire",
    type: "Simulator",
    lastModified: "3 days ago",
    status: "in-progress",
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Your <span className="text-gradient-cyber">Projects</span>
            </h1>
            <p className="text-muted-foreground">Manage and create Roblox games with AI</p>
          </div>
          
          <Link to="/workspace">
            <Button className="bg-gradient-cyber glow-primary">
              <Plus className="mr-2 h-5 w-5" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass border-primary/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Projects</p>
                <p className="text-3xl font-bold text-primary">12</p>
              </div>
              <FolderOpen className="h-10 w-10 text-primary/50" />
            </div>
          </Card>
          
          <Card className="glass border-secondary/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Credits Remaining</p>
                <p className="text-3xl font-bold text-secondary">450</p>
              </div>
              <Download className="h-10 w-10 text-secondary/50" />
            </div>
          </Card>
          
          <Card className="glass border-accent/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Activity</p>
                <p className="text-3xl font-bold text-accent">2h</p>
              </div>
              <Clock className="h-10 w-10 text-accent/50" />
            </div>
          </Card>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {mockProjects.map((project) => (
            <Link key={project.id} to={`/workspace/${project.id}`}>
              <Card className="glass border-border/50 p-6 hover:border-primary/50 transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
                      <FolderOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Last Modified</p>
                      <p className="text-sm font-medium">{project.lastModified}</p>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === "complete" 
                        ? "bg-primary/20 text-primary" 
                        : "bg-secondary/20 text-secondary"
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
