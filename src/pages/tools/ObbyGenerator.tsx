import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TaskTerminal } from "@/components/TaskTerminal";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useCredits } from "@/hooks/use-credits";
import { toast } from "sonner";
import { Mountain, Copy, Download } from "lucide-react";

export default function ObbyGenerator() {
  const { user } = useAuth();
  const { credits, refreshCredits } = useCredits();
  const [stageCount, setStageCount] = useState("10");
  const [difficulty, setDifficulty] = useState("medium");
  const [theme, setTheme] = useState("");
  const [obbyDesign, setObbyDesign] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const CREDIT_COST = 6;

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Please login to use this tool");
      return;
    }

    const stages = parseInt(stageCount);
    if (isNaN(stages) || stages < 1 || stages > 100) {
      toast.error("Please enter a valid stage count (1-100)");
      return;
    }

    if (credits < CREDIT_COST) {
      toast.error("Insufficient credits");
      return;
    }

    setIsProcessing(true);
    setObbyDesign("");

    try {
      const { data: session } = await supabase
        .from("chat_sessions")
        .insert({ user_id: user.id, title: "Obby Generation" })
        .select()
        .single();

      if (!session) throw new Error("Failed to create session");

      const themeText = theme ? ` with ${theme} theme` : "";
      const prompt = `Generate a complete ${difficulty} difficulty obby course with ${stages} stages${themeText}. Include: detailed stage designs, obstacle types, checkpoint placements, scripting requirements, and building instructions for each stage.`;

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          chatSessionId: session.id,
          message: prompt,
          taskType: "obby_generation",
          aiMode: "expert"
        }
      });

      if (error) throw error;

      setObbyDesign(data.message);
      await refreshCredits();
      toast.success("Obby generated successfully!");
    } catch (error) {
      console.error("Obby generation error:", error);
      toast.error("Failed to generate obby");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(obbyDesign);
    toast.success("Copied to clipboard!");
  };

  const downloadDesign = () => {
    const blob = new Blob([obbyDesign], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `obby_${stageCount}_stages.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500">
                <Mountain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">AI Obby Generator</h1>
                <p className="text-muted-foreground">Generate complete obby courses with unique obstacles</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1 rounded-full glass-panel">
                <Mountain className="h-4 w-4 inline mr-1 text-primary-glow" />
                {CREDIT_COST} credits per obby
              </span>
              <span className="text-muted-foreground">Your credits: {credits}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 glass-panel">
              <h3 className="text-lg font-semibold mb-4">Obby Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Number of Stages</label>
                  <Input
                    type="number"
                    value={stageCount}
                    onChange={(e) => setStageCount(e.target.value)}
                    min="1"
                    max="100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-2 rounded-lg glass-panel"
                  >
                    <option value="easy">Easy - Beginner Friendly</option>
                    <option value="medium">Medium - Moderate Challenge</option>
                    <option value="hard">Hard - Experienced Players</option>
                    <option value="extreme">Extreme - Expert Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Theme (optional)</label>
                  <Input
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g., lava, ice, space, neon"
                  />
                </div>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isProcessing}
                className="w-full mt-4"
              >
                {isProcessing ? "Generating..." : "Generate Obby"}
              </Button>
            </Card>

            <Card className="p-6 glass-panel">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Obby Design</h3>
                {obbyDesign && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadDesign}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
              {obbyDesign ? (
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-sm p-4 rounded-lg glass-panel max-h-[500px] overflow-y-auto">
                    {obbyDesign}
                  </div>
                </div>
              ) : (
                <div className="min-h-[500px] flex items-center justify-center text-muted-foreground">
                  {isProcessing ? "Creating obby design..." : "Obby design will appear here"}
                </div>
              )}
            </Card>
          </div>

          {isProcessing && (
            <TaskTerminal
              isProcessing={isProcessing}
              taskType="obby_generation"
              creditCost={CREDIT_COST}
            />
          )}
        </div>
      </div>
    </div>
  );
}
