import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bug, Sparkles, Copy, ArrowLeft, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TaskTerminal } from "@/components/TaskTerminal";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function BugFixer() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [buggyCode, setBuggyCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fixing, setFixing] = useState(false);
  const [fixedCode, setFixedCode] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const fixBug = async () => {
    if (!buggyCode.trim()) {
      toast.error("Please paste your buggy code");
      return;
    }

    setFixing(true);
    setFixedCode("");

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const errorContext = errorMessage ? `\nError message: ${errorMessage}` : "";

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            message: `Fix the bugs in this Luau code and explain what was wrong:${errorContext}\n\nCode:\n${buggyCode}`,
            taskType: "bug_fix",
            aiMode: "balanced",
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 402) {
          toast.error("Insufficient credits. This tool requires 2 credits.");
        } else {
          toast.error("Failed to fix bugs");
        }
        setFixing(false);
        return;
      }

      const result = await response.json();
      setFixedCode(result.response);
      toast.success("Bugs fixed successfully!");
    } catch (error) {
      console.error("Error fixing bugs:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setFixing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <Link to="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>

          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
                <Bug className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">AI Bug Fixer</h1>
                <p className="text-muted-foreground">2 credits per fix</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">
              Analyze and fix errors in your Luau code automatically
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 glass-panel">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Bug className="h-5 w-5 text-red-500" />
                Paste Your Buggy Code
              </h2>
              
              <Textarea
                placeholder="-- Paste your Luau code with bugs here"
                value={buggyCode}
                onChange={(e) => setBuggyCode(e.target.value)}
                className="min-h-[200px] mb-4 font-mono text-sm"
              />

              <Textarea
                placeholder="Optional: Paste error message here (if any)"
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                className="min-h-[80px] mb-4 text-sm"
              />

              <Button
                onClick={fixBug}
                disabled={fixing || !buggyCode.trim()}
                className="w-full gap-2"
              >
                {fixing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Fixing Bugs...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Fix Bugs
                  </>
                )}
              </Button>

              <div className="mt-6 p-4 rounded-lg bg-muted/30 space-y-2">
                <h3 className="font-medium text-sm">Pro Tips:</h3>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Include the complete code context</li>
                  <li>Paste any error messages you're getting</li>
                  <li>Mention what the code is supposed to do</li>
                  <li>Include variable declarations if relevant</li>
                </ul>
              </div>
            </Card>

            <div className="space-y-6">
              {fixing && (
                <TaskTerminal isProcessing={fixing} taskType="bug_fix" creditCost={2} />
              )}

              {fixedCode && !fixing && (
                <Card className="glass-panel overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-border/50 flex items-center justify-between">
                    <h2 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Fixed Code & Explanation
                    </h2>
                  </div>
                  <div className="max-h-[600px] overflow-y-auto p-6">
                    <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm">
                      {fixedCode}
                    </div>
                  </div>
                </Card>
              )}

              {!fixedCode && !fixing && (
                <Card className="p-8 glass-panel text-center">
                  <Bug className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Fixed code and explanation will appear here
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
