import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Layout, Sparkles, Copy, Download, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TaskTerminal } from "@/components/TaskTerminal";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function UIBuilder() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedUI, setGeneratedUI] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const generateUI = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe the UI you want to create");
      return;
    }

    setGenerating(true);
    setGeneratedUI("");

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
            message: `Generate a Roblox UI using ScreenGui and Frame/TextButton elements: ${prompt}. Include proper sizing, positioning, and styling.`,
            taskType: "ui_generation",
            aiMode: "balanced",
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 402) {
          toast.error("Insufficient credits. This tool requires 3 credits.");
        } else {
          toast.error("Failed to generate UI");
        }
        setGenerating(false);
        return;
      }

      const result = await response.json();
      setGeneratedUI(result.response);
      toast.success("UI generated successfully!");
    } catch (error) {
      console.error("Error generating UI:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUI);
    toast.success("Copied to clipboard!");
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Layout className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">AI UI Builder</h1>
                <p className="text-muted-foreground">3 credits per generation</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">
              Create modern, responsive user interfaces with custom designs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 glass-panel">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary-glow" />
                Describe Your UI
              </h2>
              
              <Textarea
                placeholder="Example: Create a modern shop UI with item cards, a currency display at the top, and buy buttons. Use dark theme with neon accents."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[200px] mb-4"
              />

              <Button
                onClick={generateUI}
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
                    Generate UI
                  </>
                )}
              </Button>

              <div className="mt-6 p-4 rounded-lg bg-muted/30 space-y-2">
                <h3 className="font-medium text-sm">Pro Tips:</h3>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Specify the type of UI (menu, HUD, shop, etc.)</li>
                  <li>Mention color scheme and style preferences</li>
                  <li>Include any interactive elements needed</li>
                  <li>Describe layout and positioning</li>
                </ul>
              </div>
            </Card>

            <div className="space-y-6">
              {generating && (
                <TaskTerminal isProcessing={generating} taskType="ui_generation" creditCost={3} />
              )}

              {generatedUI && !generating && (
                <Card className="glass-panel overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-border/50 flex items-center justify-between">
                    <h2 className="font-semibold">Generated UI Code</h2>
                    <Button size="sm" variant="ghost" onClick={copyToClipboard} className="gap-2">
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                  <div className="max-h-[600px] overflow-y-auto">
                    <SyntaxHighlighter
                      language="lua"
                      style={atomOneDark}
                      customStyle={{
                        margin: 0,
                        padding: "1.5rem",
                        background: "transparent",
                      }}
                    >
                      {generatedUI}
                    </SyntaxHighlighter>
                  </div>
                </Card>
              )}

              {!generatedUI && !generating && (
                <Card className="p-8 glass-panel text-center">
                  <Layout className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Your generated UI will appear here
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
