import { Navigation } from "@/components/Navigation";
import { AITerminal } from "@/components/AITerminal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Play, RotateCcw, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Workspace() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [projectName, setProjectName] = useState("New Project");
  const [gameType, setGameType] = useState("");
  const [prompt, setPrompt] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (id && user) {
      loadProject();
    }
  }, [id, user]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setProjectName(data.name);
        setGameType(data.type || "");
        setPrompt(data.prompt);
      }
    } catch (error: any) {
      toast.error("Failed to load project");
      console.error("Error loading project:", error);
    }
  };

  const saveProject = async () => {
    if (!user) return;
    if (!projectName.trim() || !prompt.trim()) {
      toast.error("Please fill in project name and prompt");
      return;
    }

    setSaving(true);
    try {
      if (id) {
        const { error } = await supabase
          .from("projects")
          .update({
            name: projectName,
            type: gameType,
            prompt: prompt,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (error) throw error;
        toast.success("Project saved!");
      } else {
        const { data, error } = await supabase
          .from("projects")
          .insert({
            user_id: user.id,
            name: projectName,
            type: gameType,
            prompt: prompt,
            status: "in-progress",
          })
          .select()
          .single();

        if (error) throw error;
        
        toast.success("Project created!");
        navigate(`/workspace/${data.id}`);
      }
    } catch (error: any) {
      toast.error("Failed to save project");
      console.error("Error saving project:", error);
    } finally {
      setSaving(false);
    }
  };

  const generateGame = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a game description");
      return;
    }

    await saveProject();
    
    toast.info("AI generation coming soon! For now, your project has been saved.");
  };

  if (loading) {
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border-border">
              <div className="space-y-4 mb-4">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="My Awesome Game"
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <Label htmlFor="gameType">Game Type (Optional)</Label>
                  <Input
                    id="gameType"
                    value={gameType}
                    onChange={(e) => setGameType(e.target.value)}
                    placeholder="e.g. Battle Royale, Simulator, Obby"
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4">Game Description</h2>
              
              <Textarea
                placeholder="Describe your Roblox game in detail. Example: Create a battle royale game with 100 players, shrinking zone, weapon pickups, building mechanics..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32 mb-4 bg-background border-border"
              />
              
              <div className="flex gap-3">
                <Button onClick={generateGame} className="flex-1 gap-2">
                  <Play className="h-4 w-4" />
                  Generate Game
                </Button>
                <Button variant="outline" onClick={saveProject} disabled={saving} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" size="icon">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            <Card className="p-6 border-border">
              <Tabs defaultValue="concept" className="w-full">
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="concept">Concept</TabsTrigger>
                  <TabsTrigger value="scripts">Scripts</TabsTrigger>
                  <TabsTrigger value="ui">UI</TabsTrigger>
                  <TabsTrigger value="assets">Assets</TabsTrigger>
                  <TabsTrigger value="export">Export</TabsTrigger>
                </TabsList>
                
                <TabsContent value="concept" className="mt-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Design Document</h3>
                    <div className="p-4 rounded bg-muted text-sm text-muted-foreground">
                      Your game design document will appear here after generation...
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="scripts" className="mt-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Generated Scripts</h3>
                    <div className="p-4 rounded bg-muted font-mono text-sm">
                      <p className="text-muted-foreground">-- Scripts will be generated here</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="ui" className="mt-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">UI Components</h3>
                    <div className="p-4 rounded bg-muted text-sm text-muted-foreground">
                      UI layouts will be shown here...
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="assets" className="mt-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Asset Organization</h3>
                    <div className="p-4 rounded bg-muted text-sm text-muted-foreground">
                      Explorer structure will appear here...
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="export" className="mt-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Export Project</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Export your complete game as an RBXL file for Roblox Studio
                    </p>
                    <Button className="w-full gap-2" disabled>
                      <Download className="h-4 w-4" />
                      Download RBXL File (Coming Soon)
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <AITerminal />
          </div>
        </div>
      </div>
    </div>
  );
}
