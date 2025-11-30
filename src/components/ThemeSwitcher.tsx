import { Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme, themes } from "@/hooks/use-theme";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 glass-panel border-border/50 bg-card/95 backdrop-blur-xl z-50"
      >
        {Object.entries(themes).map(([key, themeData]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setTheme(key as keyof typeof themes)}
            className={`cursor-pointer hover:bg-primary/10 transition-colors ${
              theme === key ? "bg-primary/20" : ""
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span>{themeData.name}</span>
              {theme === key && (
                <Check className="h-4 w-4 text-primary-glow" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
