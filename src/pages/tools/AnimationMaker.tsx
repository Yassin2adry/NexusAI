import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TaskTerminal } from "@/components/TaskTerminal";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useCredits } from "@/hooks/use-credits";
import { toast } from "sonner";
import { Film, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function AnimationMaker() {
  const { user } = useAuth();
  const { credits, refreshCredits } = useCredits();
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("1");
  const [animationType, setAnimationType] = useState("tween");
  const [animationCode, setAnimationCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const CREDIT_COST = 4;

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Please login to use this tool");
      return;
    }

    if (!description.trim()) {
      toast.error("Please describe the animation");
      return;
    }

    if (credits < CREDIT_COST) {
      toast.error("Insufficient credits");
      return;
    }

    setIsProcessing(true);
    setAnimationCode("");

    try {
      const { data: session } = await supabase
        .from("chat_sessions")
        .insert({ user_id: user.id, title: "Animation Creation" })
        .select()
        .single();

      if (!session) throw new Error("Failed to create session");

      const prompt = `Create a Roblox ${animationType} animation with duration ${duration} seconds: ${description}. Provide complete Luau code with TweenService or animation tracks as appropriate.`;

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          chatSessionId: session.id,
          message: prompt,
          taskType: "animation_generation",
          aiMode: "balanced"
        }
      });

      if (error) throw error;

      const response = data.message;
      const codeMatch = response.match(/```(?:lua|luau)?\n([\s\S]*?)```/);
      
      setAnimationCode(codeMatch ? codeMatch[1].trim() : response);
      await refreshCredits();
      toast.success("Animation generated successfully!");
    } catch (error) {
      console.error("Animation generation error:", error);
      toast.error("Failed to generate animation");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(animationCode);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
                <Film className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">AI Animation Maker</h1>
                <p className="text-muted-foreground">Create custom animations and tween sequences</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1 rounded-full glass-panel">
                <Film className="h-4 w-4 inline mr-1 text-primary-glow" />
                {CREDIT_COST} credits per animation
              </span>
              <span className="text-muted-foreground">Your credits: {credits}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 glass-panel">
              <h3 className="text-lg font-semibold mb-4">Animation Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Animation Type</label>
                  <select
                    value={animationType}
                    onChange={(e) => setAnimationType(e.target.value)}
                    className="w-full p-2 rounded-lg glass-panel"
                  >
                    <option value="tween">Tween Animation</option>
                    <option value="keyframe">Keyframe Animation</option>
                    <option value="spring">Spring Animation</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Duration (seconds)</label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="0.1"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the animation (e.g., 'smooth door opening', 'bouncing ball', 'rotating platform')"
                    className="min-h-[200px]"
                  />
                </div>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isProcessing || !description.trim()}
                className="w-full mt-4"
              >
                {isProcessing ? "Generating..." : "Generate Animation"}
              </Button>
            </Card>

            <Card className="p-6 glass-panel">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Generated Code</h3>
                {animationCode && (
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                )}
              </div>
              {animationCode ? (
                <div className="rounded-lg overflow-hidden">
                  <SyntaxHighlighter
                    language="lua"
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, maxHeight: "500px" }}
                  >
                    {animationCode}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <div className="min-h-[500px] flex items-center justify-center text-muted-foreground">
                  {isProcessing ? "Creating animation..." : "Animation code will appear here"}
                </div>
              )}
            </Card>
          </div>

          {isProcessing && (
            <TaskTerminal
              isProcessing={isProcessing}
              taskType="animation_generation"
              creditCost={CREDIT_COST}
            />
          )}
        </div>
      </div>
    </div>
  );
}
