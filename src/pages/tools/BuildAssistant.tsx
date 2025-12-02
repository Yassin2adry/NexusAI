import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { TaskTerminal } from "@/components/TaskTerminal";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useCredits } from "@/hooks/use-credits";
import { toast } from "sonner";
import { Hammer, Copy } from "lucide-react";

export default function BuildAssistant() {
  const { user } = useAuth();
  const { credits, refreshCredits } = useCredits();
  const [buildRequest, setBuildRequest] = useState("");
  const [guidance, setGuidance] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const CREDIT_COST = 3;

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Please login to use this tool");
      return;
    }

    if (!buildRequest.trim()) {
      toast.error("Please describe what you want to build");
      return;
    }

    if (credits < CREDIT_COST) {
      toast.error("Insufficient credits");
      return;
    }

    setIsProcessing(true);
    setGuidance("");

    try {
      const { data: session } = await supabase
        .from("chat_sessions")
        .insert({ user_id: user.id, title: "Build Guidance" })
        .select()
        .single();

      if (!session) throw new Error("Failed to create session");

      const prompt = `I want to build: ${buildRequest}. Provide detailed step-by-step guidance on how to build this in Roblox Studio, including part placement, sizing, materials, colors, and any special techniques.`;

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          chatSessionId: session.id,
          message: prompt,
          taskType: "build_guidance",
          aiMode: "balanced"
        }
      });

      if (error) throw error;

      setGuidance(data.message);
      await refreshCredits();
      toast.success("Guidance generated successfully!");
    } catch (error) {
      console.error("Build guidance error:", error);
      toast.error("Failed to generate guidance");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(guidance);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                <Hammer className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">AI Build Assistant</h1>
                <p className="text-muted-foreground">Get guidance on building structures and game worlds</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1 rounded-full glass-panel">
                <Hammer className="h-4 w-4 inline mr-1 text-primary-glow" />
                {CREDIT_COST} credits per request
              </span>
              <span className="text-muted-foreground">Your credits: {credits}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 glass-panel">
              <h3 className="text-lg font-semibold mb-4">What do you want to build?</h3>
              <Textarea
                value={buildRequest}
                onChange={(e) => setBuildRequest(e.target.value)}
                placeholder="Describe your building project (e.g., 'medieval castle', 'modern city', 'fantasy dungeon', 'racing track')"
                className="min-h-[300px]"
              />
              <Button
                onClick={handleGenerate}
                disabled={isProcessing || !buildRequest.trim()}
                className="w-full mt-4"
              >
                {isProcessing ? "Analyzing..." : "Get Building Guidance"}
              </Button>
            </Card>

            <Card className="p-6 glass-panel">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Building Guide</h3>
                {guidance && (
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                )}
              </div>
              {guidance ? (
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-sm p-4 rounded-lg glass-panel max-h-[500px] overflow-y-auto">
                    {guidance}
                  </div>
                </div>
              ) : (
                <div className="min-h-[500px] flex items-center justify-center text-muted-foreground">
                  {isProcessing ? "Creating guidance..." : "Building guide will appear here"}
                </div>
              )}
            </Card>
          </div>

          {isProcessing && (
            <TaskTerminal
              isProcessing={isProcessing}
              taskType="build_guidance"
              creditCost={CREDIT_COST}
            />
          )}
        </div>
      </div>
    </div>
  );
}
