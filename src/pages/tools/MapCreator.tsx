import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Map, Sparkles, Copy, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TaskTerminal } from "@/components/TaskTerminal";

export default function MapCreator() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedMap, setGeneratedMap] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const generateMap = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe the map you want to create");
      return;
    }

    setGenerating(true);
    setGeneratedMap("");

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            message: `Generate a Roblox map/terrain layout with detailed structure: ${prompt}. Include terrain types, spawn points, and key landmarks.`,
            taskType: "map_creation",
            aiMode: "expert",
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 402) {
          toast.error("Insufficient credits. This tool requires 8 credits.");
        } else {
          toast.error("Failed to generate map");
        }
        setGenerating(false);
        return;
      }

      const result = await response.json();
      setGeneratedMap(result.response);
      toast.success("Map design generated successfully!");
    } catch (error) {
      console.error("Error generating map:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto">
          <Link to="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>

          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                <Map className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">AI Map Creator</h1>
                <p className="text-muted-foreground">8 credits per generation</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">
              Generate complete game maps with terrain and structures
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 glass-panel">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary-glow" />
                Describe Your Map
              </h2>
              
              <Textarea
                placeholder="Example: Create a medieval castle map with stone walls, towers, a courtyard, and surrounding forest. Include secret passages and a dungeon."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[200px] mb-4"
              />

              <Button
                onClick={generateMap}
                disabled={generating || !prompt.trim()}
                className="w-full gap-2"
              >
                {generating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Map
                  </>
                )}
              </Button>

              <div className="mt-6 p-4 rounded-lg bg-muted/30 space-y-2">
                <h3 className="font-medium text-sm">Pro Tips:</h3>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Specify the theme and setting</li>
                  <li>Include terrain types (mountains, water, etc.)</li>
                  <li>Mention key structures and landmarks</li>
                  <li>Describe the map size and scale</li>
                </ul>
              </div>
            </Card>

            <div className="space-y-6">
              {generating && (
                <TaskTerminal isProcessing={generating} taskType="map_creation" creditCost={8} />
              )}

              {generatedMap && !generating && (
                <Card className="p-6 glass-panel animate-fade-in">
                  <h2 className="font-semibold mb-4">Generated Map Design</h2>
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {generatedMap}
                    </div>
                  </div>
                </Card>
              )}

              {!generatedMap && !generating && (
                <Card className="p-8 glass-panel text-center">
                  <Map className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Your generated map design will appear here
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
