import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Zap, Brain, Rocket, Crown } from "lucide-react";

interface AiMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  credits: number;
}

const AI_MODES: AiMode[] = [
  {
    id: "fast",
    name: "Fast Mode",
    description: "Quick responses",
    icon: <Zap className="h-4 w-4" />,
    credits: 1,
  },
  {
    id: "balanced",
    name: "Balanced Mode",
    description: "Default mode",
    icon: <Brain className="h-4 w-4" />,
    credits: 1,
  },
  {
    id: "advanced",
    name: "Advanced Mode",
    description: "Deeper analysis",
    icon: <Rocket className="h-4 w-4" />,
    credits: 2,
  },
  {
    id: "expert",
    name: "Expert Mode",
    description: "Maximum intelligence",
    icon: <Crown className="h-4 w-4" />,
    credits: 2,
  },
];

interface AiModeSelectorProps {
  selectedMode: string;
  onModeChange: (mode: string) => void;
}

export function AiModeSelector({ selectedMode, onModeChange }: AiModeSelectorProps) {
  const currentMode = AI_MODES.find((mode) => mode.id === selectedMode) || AI_MODES[1];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {currentMode.icon}
          <span className="hidden sm:inline">{currentMode.name}</span>
          <span className="text-xs text-muted-foreground">({currentMode.credits} credit{currentMode.credits > 1 ? 's' : ''})</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {AI_MODES.map((mode) => (
          <DropdownMenuItem
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`flex items-start gap-3 p-3 cursor-pointer ${
              selectedMode === mode.id ? "bg-primary/10" : ""
            }`}
          >
            <div className="p-1.5 rounded-lg bg-primary/10">{mode.icon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{mode.name}</span>
                <span className="text-xs text-muted-foreground">
                  {mode.credits} credit{mode.credits > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{mode.description}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
