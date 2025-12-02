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
import { Zap, Copy, Download } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function OptimizationTool() {
  const { user } = useAuth();
  const { credits, refreshCredits } = useCredits();
  const [code, setCode] = useState("");
  const [optimizedCode, setOptimizedCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState("");

  const CREDIT_COST = 3;

  const handleOptimize = async () => {
    if (!user) {
      toast.error("Please login to use this tool");
      return;
    }

    if (!code.trim()) {
      toast.error("Please enter code to optimize");
      return;
    }

    if (credits < CREDIT_COST) {
      toast.error("Insufficient credits");
      return;
    }

    setIsProcessing(true);
    setOptimizedCode("");
    setAnalysis("");

    try {
      const { data: session } = await supabase
        .from("chat_sessions")
        .insert({ user_id: user.id, title: "Code Optimization" })
        .select()
        .single();

      if (!session) throw new Error("Failed to create session");

      const prompt = `Optimize this Luau code for better performance and efficiency. Provide the optimized code and explain what improvements were made:\n\n${code}`;

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          chatSessionId: session.id,
          message: prompt,
          taskType: "code_optimization",
          aiMode: "advanced"
        }
      });

      if (error) throw error;

      const response = data.message;
      
      // Try to extract code and analysis
      const codeMatch = response.match(/```(?:lua|luau)?\n([\s\S]*?)```/);
      if (codeMatch) {
        setOptimizedCode(codeMatch[1].trim());
        setAnalysis(response.replace(/```(?:lua|luau)?\n[\s\S]*?```/, "").trim());
      } else {
        setOptimizedCode(response);
      }

      await refreshCredits();
      toast.success("Code optimized successfully!");
    } catch (error) {
      console.error("Optimization error:", error);
      toast.error("Failed to optimize code");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(optimizedCode);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">AI Optimization Tool</h1>
                <p className="text-muted-foreground">Optimize your Luau scripts for better performance</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1 rounded-full glass-panel">
                <Zap className="h-4 w-4 inline mr-1 text-primary-glow" />
                {CREDIT_COST} credits per optimization
              </span>
              <span className="text-muted-foreground">Your credits: {credits}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 glass-panel">
              <h3 className="text-lg font-semibold mb-4">Your Code</h3>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your Luau code here..."
                className="min-h-[400px] font-mono text-sm"
              />
              <Button
                onClick={handleOptimize}
                disabled={isProcessing || !code.trim()}
                className="w-full mt-4"
              >
                {isProcessing ? "Optimizing..." : "Optimize Code"}
              </Button>
            </Card>

            <Card className="p-6 glass-panel">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Optimized Code</h3>
                {optimizedCode && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                )}
              </div>
              {optimizedCode ? (
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden">
                    <SyntaxHighlighter
                      language="lua"
                      style={vscDarkPlus}
                      customStyle={{ margin: 0, maxHeight: "400px" }}
                    >
                      {optimizedCode}
                    </SyntaxHighlighter>
                  </div>
                  {analysis && (
                    <div className="p-4 rounded-lg glass-panel">
                      <h4 className="font-semibold mb-2">Analysis</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysis}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
                  {isProcessing ? "Analyzing and optimizing..." : "Optimized code will appear here"}
                </div>
              )}
            </Card>
          </div>

          {isProcessing && (
            <TaskTerminal
              isProcessing={isProcessing}
              taskType="code_optimization"
              creditCost={CREDIT_COST}
            />
          )}
        </div>
      </div>
    </div>
  );
}
