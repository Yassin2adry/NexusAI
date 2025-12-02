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
import { Boxes, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ModuleMaker() {
  const { user } = useAuth();
  const { credits, refreshCredits } = useCredits();
  const [moduleName, setModuleName] = useState("");
  const [description, setDescription] = useState("");
  const [moduleType, setModuleType] = useState("utility");
  const [moduleCode, setModuleCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const CREDIT_COST = 4;

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Please login to use this tool");
      return;
    }

    if (!moduleName.trim() || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (credits < CREDIT_COST) {
      toast.error("Insufficient credits");
      return;
    }

    setIsProcessing(true);
    setModuleCode("");

    try {
      const { data: session } = await supabase
        .from("chat_sessions")
        .insert({ user_id: user.id, title: "Module Creation" })
        .select()
        .single();

      if (!session) throw new Error("Failed to create session");

      const prompt = `Create a reusable Roblox ModuleScript named "${moduleName}" (${moduleType} module) that ${description}. Include proper structure, documentation, and error handling.`;

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          chatSessionId: session.id,
          message: prompt,
          taskType: "module_generation",
          aiMode: "balanced"
        }
      });

      if (error) throw error;

      const response = data.message;
      const codeMatch = response.match(/```(?:lua|luau)?\n([\s\S]*?)```/);
      
      setModuleCode(codeMatch ? codeMatch[1].trim() : response);
      await refreshCredits();
      toast.success("Module generated successfully!");
    } catch (error) {
      console.error("Module generation error:", error);
      toast.error("Failed to generate module");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(moduleCode);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500">
                <Boxes className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">AI Module Maker</h1>
                <p className="text-muted-foreground">Build reusable ModuleScripts with proper structure</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1 rounded-full glass-panel">
                <Boxes className="h-4 w-4 inline mr-1 text-primary-glow" />
                {CREDIT_COST} credits per module
              </span>
              <span className="text-muted-foreground">Your credits: {credits}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 glass-panel">
              <h3 className="text-lg font-semibold mb-4">Module Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Module Name</label>
                  <Input
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    placeholder="e.g., DataManager, CombatSystem"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Module Type</label>
                  <select
                    value={moduleType}
                    onChange={(e) => setModuleType(e.target.value)}
                    className="w-full p-2 rounded-lg glass-panel"
                  >
                    <option value="utility">Utility Module</option>
                    <option value="manager">Manager/Controller</option>
                    <option value="service">Service Module</option>
                    <option value="data">Data Handler</option>
                    <option value="library">Library/Helper</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this module should do..."
                    className="min-h-[200px]"
                  />
                </div>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isProcessing || !moduleName.trim() || !description.trim()}
                className="w-full mt-4"
              >
                {isProcessing ? "Generating..." : "Generate Module"}
              </Button>
            </Card>

            <Card className="p-6 glass-panel">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Generated Module</h3>
                {moduleCode && (
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                )}
              </div>
              {moduleCode ? (
                <div className="rounded-lg overflow-hidden">
                  <SyntaxHighlighter
                    language="lua"
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, maxHeight: "500px" }}
                  >
                    {moduleCode}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <div className="min-h-[500px] flex items-center justify-center text-muted-foreground">
                  {isProcessing ? "Creating module..." : "Module code will appear here"}
                </div>
              )}
            </Card>
          </div>

          {isProcessing && (
            <TaskTerminal
              isProcessing={isProcessing}
              taskType="module_generation"
              creditCost={CREDIT_COST}
            />
          )}
        </div>
      </div>
    </div>
  );
}
