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
import { MessageSquare, Copy, Download } from "lucide-react";

export default function DialogueWriter() {
  const { user } = useAuth();
  const { credits, refreshCredits } = useCredits();
  const [npcName, setNpcName] = useState("");
  const [npcPersonality, setNpcPersonality] = useState("");
  const [context, setContext] = useState("");
  const [dialogueType, setDialogueType] = useState("quest");
  const [dialogue, setDialogue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const CREDIT_COST = 2;

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Please login to use this tool");
      return;
    }

    if (!npcName.trim() || !context.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (credits < CREDIT_COST) {
      toast.error("Insufficient credits");
      return;
    }

    setIsProcessing(true);
    setDialogue("");

    try {
      const { data: session } = await supabase
        .from("chat_sessions")
        .insert({ user_id: user.id, title: "Dialogue Generation" })
        .select()
        .single();

      if (!session) throw new Error("Failed to create session");

      const prompt = `Generate ${dialogueType} dialogue for an NPC named "${npcName}" with personality: ${npcPersonality || "neutral"}. Context: ${context}. Include multiple dialogue options and responses.`;

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          chatSessionId: session.id,
          message: prompt,
          taskType: "dialogue_generation",
          aiMode: "balanced"
        }
      });

      if (error) throw error;

      setDialogue(data.message);
      await refreshCredits();
      toast.success("Dialogue generated successfully!");
    } catch (error) {
      console.error("Dialogue generation error:", error);
      toast.error("Failed to generate dialogue");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(dialogue);
    toast.success("Copied to clipboard!");
  };

  const downloadDialogue = () => {
    const blob = new Blob([dialogue], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${npcName}_dialogue.txt`;
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">AI Dialogue Writer</h1>
                <p className="text-muted-foreground">Generate NPC dialogue and quest text</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1 rounded-full glass-panel">
                <MessageSquare className="h-4 w-4 inline mr-1 text-primary-glow" />
                {CREDIT_COST} credits per dialogue
              </span>
              <span className="text-muted-foreground">Your credits: {credits}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 glass-panel">
              <h3 className="text-lg font-semibold mb-4">NPC Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">NPC Name</label>
                  <Input
                    value={npcName}
                    onChange={(e) => setNpcName(e.target.value)}
                    placeholder="e.g., Wizard Merlin"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Dialogue Type</label>
                  <select
                    value={dialogueType}
                    onChange={(e) => setDialogueType(e.target.value)}
                    className="w-full p-2 rounded-lg glass-panel"
                  >
                    <option value="quest">Quest Dialogue</option>
                    <option value="greeting">Greeting</option>
                    <option value="shop">Shop Keeper</option>
                    <option value="story">Story/Lore</option>
                    <option value="battle">Battle Banter</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Personality (optional)</label>
                  <Input
                    value={npcPersonality}
                    onChange={(e) => setNpcPersonality(e.target.value)}
                    placeholder="e.g., wise, grumpy, cheerful"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Context</label>
                  <Textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Describe the situation or quest..."
                    className="min-h-[150px]"
                  />
                </div>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isProcessing || !npcName.trim() || !context.trim()}
                className="w-full mt-4"
              >
                {isProcessing ? "Writing..." : "Generate Dialogue"}
              </Button>
            </Card>

            <Card className="p-6 glass-panel">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Generated Dialogue</h3>
                {dialogue && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadDialogue}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
              {dialogue ? (
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-sm p-4 rounded-lg glass-panel max-h-[500px] overflow-y-auto">
                    {dialogue}
                  </div>
                </div>
              ) : (
                <div className="min-h-[500px] flex items-center justify-center text-muted-foreground">
                  {isProcessing ? "Writing dialogue..." : "Generated dialogue will appear here"}
                </div>
              )}
            </Card>
          </div>

          {isProcessing && (
            <TaskTerminal
              isProcessing={isProcessing}
              taskType="dialogue_generation"
              creditCost={CREDIT_COST}
            />
          )}
        </div>
      </div>
    </div>
  );
}
