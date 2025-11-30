import { createContext, useContext, useEffect, useState } from "react";

export const themes = {
  "neon-nexus": {
    name: "Neon Nexus",
    colors: {
      background: "0 0% 0%",
      foreground: "0 0% 98%",
      card: "270 45% 8%",
      "card-foreground": "0 0% 98%",
      popover: "270 45% 8%",
      "popover-foreground": "0 0% 98%",
      primary: "270 80% 25%",
      "primary-foreground": "0 0% 100%",
      "primary-glow": "270 100% 60%",
      secondary: "270 60% 15%",
      "secondary-foreground": "0 0% 98%",
      muted: "270 30% 12%",
      "muted-foreground": "0 0% 60%",
      accent: "270 70% 20%",
      "accent-foreground": "0 0% 98%",
      destructive: "0 84% 60%",
      "destructive-foreground": "0 0% 98%",
      border: "270 40% 15%",
      input: "270 40% 10%",
      ring: "270 100% 60%",
    },
  },
  "midnight-ocean": {
    name: "Midnight Ocean",
    colors: {
      background: "0 0% 0%",
      foreground: "0 0% 98%",
      card: "210 50% 8%",
      "card-foreground": "0 0% 98%",
      popover: "210 50% 8%",
      "popover-foreground": "0 0% 98%",
      primary: "210 100% 35%",
      "primary-foreground": "0 0% 100%",
      "primary-glow": "210 100% 60%",
      secondary: "210 60% 15%",
      "secondary-foreground": "0 0% 98%",
      muted: "210 40% 12%",
      "muted-foreground": "0 0% 60%",
      accent: "210 70% 20%",
      "accent-foreground": "0 0% 98%",
      destructive: "0 84% 60%",
      "destructive-foreground": "0 0% 98%",
      border: "210 50% 15%",
      input: "210 50% 10%",
      ring: "210 100% 60%",
    },
  },
  "obsidian": {
    name: "Obsidian",
    colors: {
      background: "0 0% 0%",
      foreground: "0 0% 98%",
      card: "0 0% 5%",
      "card-foreground": "0 0% 98%",
      popover: "0 0% 5%",
      "popover-foreground": "0 0% 98%",
      primary: "0 0% 20%",
      "primary-foreground": "0 0% 100%",
      "primary-glow": "0 0% 60%",
      secondary: "0 0% 12%",
      "secondary-foreground": "0 0% 98%",
      muted: "0 0% 10%",
      "muted-foreground": "0 0% 60%",
      accent: "0 0% 15%",
      "accent-foreground": "0 0% 98%",
      destructive: "0 84% 60%",
      "destructive-foreground": "0 0% 98%",
      border: "0 0% 18%",
      input: "0 0% 8%",
      ring: "0 0% 60%",
    },
  },
  "cyber-crimson": {
    name: "Cyber Crimson",
    colors: {
      background: "0 0% 0%",
      foreground: "0 0% 98%",
      card: "350 50% 8%",
      "card-foreground": "0 0% 98%",
      popover: "350 50% 8%",
      "popover-foreground": "0 0% 98%",
      primary: "350 85% 35%",
      "primary-foreground": "0 0% 100%",
      "primary-glow": "350 100% 60%",
      secondary: "350 60% 15%",
      "secondary-foreground": "0 0% 98%",
      muted: "350 30% 12%",
      "muted-foreground": "0 0% 60%",
      accent: "350 70% 20%",
      "accent-foreground": "0 0% 98%",
      destructive: "0 84% 60%",
      "destructive-foreground": "0 0% 98%",
      border: "350 40% 15%",
      input: "350 40% 10%",
      ring: "350 100% 60%",
    },
  },
  "emerald-matrix": {
    name: "Emerald Matrix",
    colors: {
      background: "0 0% 0%",
      foreground: "0 0% 98%",
      card: "150 50% 8%",
      "card-foreground": "0 0% 98%",
      popover: "150 50% 8%",
      "popover-foreground": "0 0% 98%",
      primary: "150 80% 30%",
      "primary-foreground": "0 0% 100%",
      "primary-glow": "150 100% 50%",
      secondary: "150 60% 15%",
      "secondary-foreground": "0 0% 98%",
      muted: "150 30% 12%",
      "muted-foreground": "0 0% 60%",
      accent: "150 70% 20%",
      "accent-foreground": "0 0% 98%",
      destructive: "0 84% 60%",
      "destructive-foreground": "0 0% 98%",
      border: "150 40% 15%",
      input: "150 40% 10%",
      ring: "150 100% 50%",
    },
  },
  "solar-flare": {
    name: "Solar Flare",
    colors: {
      background: "0 0% 0%",
      foreground: "0 0% 98%",
      card: "30 50% 8%",
      "card-foreground": "0 0% 98%",
      popover: "30 50% 8%",
      "popover-foreground": "0 0% 98%",
      primary: "30 100% 40%",
      "primary-foreground": "0 0% 100%",
      "primary-glow": "30 100% 60%",
      secondary: "30 60% 15%",
      "secondary-foreground": "0 0% 98%",
      muted: "30 30% 12%",
      "muted-foreground": "0 0% 60%",
      accent: "30 70% 20%",
      "accent-foreground": "0 0% 98%",
      destructive: "0 84% 60%",
      "destructive-foreground": "0 0% 98%",
      border: "30 40% 15%",
      input: "30 40% 10%",
      ring: "30 100% 60%",
    },
  },
  "arctic-frost": {
    name: "Arctic Frost",
    colors: {
      background: "0 0% 0%",
      foreground: "0 0% 98%",
      card: "190 50% 8%",
      "card-foreground": "0 0% 98%",
      popover: "190 50% 8%",
      "popover-foreground": "0 0% 98%",
      primary: "190 90% 35%",
      "primary-foreground": "0 0% 100%",
      "primary-glow": "190 100% 60%",
      secondary: "190 60% 15%",
      "secondary-foreground": "0 0% 98%",
      muted: "190 30% 12%",
      "muted-foreground": "0 0% 60%",
      accent: "190 70% 20%",
      "accent-foreground": "0 0% 98%",
      destructive: "0 84% 60%",
      "destructive-foreground": "0 0% 98%",
      border: "190 40% 15%",
      input: "190 40% 10%",
      ring: "190 100% 60%",
    },
  },
  "royal-amethyst": {
    name: "Royal Amethyst",
    colors: {
      background: "0 0% 0%",
      foreground: "0 0% 98%",
      card: "280 50% 8%",
      "card-foreground": "0 0% 98%",
      popover: "280 50% 8%",
      "popover-foreground": "0 0% 98%",
      primary: "280 70% 40%",
      "primary-foreground": "0 0% 100%",
      "primary-glow": "280 100% 65%",
      secondary: "280 60% 15%",
      "secondary-foreground": "0 0% 98%",
      muted: "280 30% 12%",
      "muted-foreground": "0 0% 60%",
      accent: "280 70% 20%",
      "accent-foreground": "0 0% 98%",
      destructive: "0 84% 60%",
      "destructive-foreground": "0 0% 98%",
      border: "280 40% 15%",
      input: "280 40% 10%",
      ring: "280 100% 65%",
    },
  },
  "void-black": {
    name: "Void Black",
    colors: {
      background: "0 0% 0%",
      foreground: "0 0% 95%",
      card: "0 0% 3%",
      "card-foreground": "0 0% 95%",
      popover: "0 0% 3%",
      "popover-foreground": "0 0% 95%",
      primary: "0 0% 15%",
      "primary-foreground": "0 0% 100%",
      "primary-glow": "0 0% 50%",
      secondary: "0 0% 8%",
      "secondary-foreground": "0 0% 95%",
      muted: "0 0% 6%",
      "muted-foreground": "0 0% 50%",
      accent: "0 0% 12%",
      "accent-foreground": "0 0% 95%",
      destructive: "0 84% 60%",
      "destructive-foreground": "0 0% 98%",
      border: "0 0% 15%",
      input: "0 0% 5%",
      ring: "0 0% 50%",
    },
  },
};

type Theme = keyof typeof themes;

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "neon-nexus",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "neon-nexus",
  storageKey = "nexus-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const themeColors = themes[theme].colors;

    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
