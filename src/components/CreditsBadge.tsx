import { Zap } from "lucide-react";
import { useCredits } from "@/hooks/use-credits";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CreditsBadge() {
  const { credits, loading } = useCredits();

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel">
        <Zap className="h-4 w-4 text-primary-glow animate-pulse" />
        <span className="text-sm font-medium">...</span>
      </div>
    );
  }

  return (
    <Link to="/account">
      <Button
        variant="ghost"
        size="sm"
        className={`gap-2 hover:bg-primary/10 ${
          credits < 10 ? "text-destructive animate-pulse" : ""
        }`}
      >
        <Zap className="h-4 w-4 text-primary-glow" />
        <span className="font-bold">{credits}</span>
      </Button>
    </Link>
  );
}
