import { createContext, useContext, useEffect, useState } from "react";

export const themes = {
  "neon-nexus": {
    name: "Neon Nexus",
    colors: {
      background: "240 10% 4%",
      foreground: "0 0% 98%",
      card: "240 10% 6%",
      "card-foreground": "0 0% 98%",
      popover: "240 10% 6%",
      "popover-foreground": "0 0% 98%",
      primary: "265 85% 55%",
      "primary-foreground": "0 0% 100%",
      "primary-glow": "265 100% 65%",
      secondary: "240 10% 12%",
      "secondary-foreground": "0 0% 98%",
      muted: "240 10% 14%",
      "muted-foreground": "240 5% 55%",
      accent: "265 50% 20%",
      "accent-foreground": "0 0% 98%",
      destructive: "0 72% 51%",
      "destructive-foreground": "0 0% 98%",
      border: "240 10% 15%",
      input: "240 10% 10%",
      ring: "265 100% 65%",
    },
  },
  "midnight-ocean": {
    name: "Midnight Ocean",
    colors: {
      background: "220 15% 5%",
      foreground: "0 0% 98%",
      card: "220 15% 7%",
      "card-foreground": "0 0% 98%",
      popover: "220 15% 7%",
      "popover-foreground": "0 0% 98%",
      primary: "210 100% 50%",
      "primary-foreground": "0 0% 100%",
      "primary-glow": "210 100% 60%",
      secondary: "220 15% 12%",
      "secondary-foreground": "0 0% 98%",
      muted: "220 15% 14%",
      "muted-foreground": "220 5% 55%",
      accent: "210 50% 20%",
      "accent-foreground": "0 0% 98%",
      destructive: "0 72% 51%",
      "destructive-foreground": "0 0% 98%",
      border: "220 15% 15%",
      input: "220 15% 10%",
      ring: "210 100% 60%",
    },
  },
  "cyber-crimson": {
    name: "Cyber Crimson",
    colors: {
      background: "0 10% 4%",
      foreground: "0 0% 98%",
      card: "0 10% 6%",
      "card-foreground": "0 0% 98%",
      popover: "0 10% 6%",
      "popover-foreground": "0 0% 98%",
      primary: "350 90% 50%",
      "primary-foreground": "0 0% 100%",
      "primary-glow": "350 100% 60%",
      secondary: "0 10% 12%",
      "secondary-foreground": "0 0% 98%",
      muted: "0 10% 14%",
      "muted-foreground": "0 5% 55%",
      accent: "350 50% 20%",
      "accent-foreground": "0 0% 98%",
      destructive: "0 72% 51%",
      "destructive-foreground": "0 0% 98%",
      border: "0 10% 15%",
      input: "0 10% 10%",
      ring: "350 100% 60%",
    },
  },
  "emerald-matrix": {
    name: "Emerald Matrix",
    colors: {
      background: "150 10% 4%",
      foreground: "0 0% 98%",
      card: "150 10% 6%",
      "card-foreground": "0 0% 98%",
      popover: "150 10% 6%",
      "popover-foreground": "0 0% 98%",
      primary: "145 80% 45%",
      "primary-foreground": "0 0% 100%",
      "primary-glow": "145 100% 50%",
      secondary: "150 10% 12%",
      "secondary-foreground": "0 0% 98%",
      muted: "150 10% 14%",
      "muted-foreground": "150 5% 55%",
      accent: "145 50% 20%",
      "accent-foreground": "0 0% 98%",
      destructive: "0 72% 51%",
      "destructive-foreground": "0 0% 98%",
      border: "150 10% 15%",
      input: "150 10% 10%",
      ring: "145 100% 50%",
    },
  },
  "solar-flare": {
    name: "Solar Flare",
    colors: {
      background: "25 15% 5%",
      foreground: "0 0% 98%",
      card: "25 15% 7%",
      "card-foreground": "0 0% 98%",
      popover: "25 15% 7%",
      "popover-foreground": "0 0% 98%",
      primary: "25 100% 50%",
      "primary-foreground": "0 0% 100%",
      "primary-glow": "25 100% 60%",
      secondary: "25 15% 12%",
      "secondary-foreground": "0 0% 98%",
      muted: "25 15% 14%",
      "muted-foreground": "25 5% 55%",
      accent: "25 50% 20%",
      "accent-foreground": "0 0% 98%",
      destructive: "0 72% 51%",
      "destructive-foreground": "0 0% 98%",
      border: "25 15% 15%",
      input: "25 15% 10%",
      ring: "25 100% 60%",
    },
  },
  "arctic-frost": {
    name: "Arctic Frost",
    colors: {
      background: "200 15% 5%",
      foreground: "0 0% 98%",
      card: "200 15% 7%",
      "card-foreground": "0 0% 98%",
      popover: "200 15% 7%",
      "popover-foreground": "0 0% 98%",
      primary: "190 90% 45%",
      "primary-foreground": "0 0% 100%",
      "primary-glow": "190 100% 55%",
      secondary: "200 15% 12%",
      "secondary-foreground": "0 0% 98%",
      muted: "200 15% 14%",
      "muted-foreground": "200 5% 55%",
      accent: "190 50% 20%",
      "accent-foreground": "0 0% 98%",
      destructive: "0 72% 51%",
      "destructive-foreground": "0 0% 98%",
      border: "200 15% 15%",
      input: "200 15% 10%",
      ring: "190 100% 55%",
    },
  },
  "void-black": {
    name: "Void Black",
    colors: {
      background: "0 0% 3%",
      foreground: "0 0% 95%",
      card: "0 0% 5%",
      "card-foreground": "0 0% 95%",
      popover: "0 0% 5%",
      "popover-foreground": "0 0% 95%",
      primary: "0 0% 40%",
      "primary-foreground": "0 0% 100%",
      "primary-glow": "0 0% 60%",
      secondary: "0 0% 10%",
      "secondary-foreground": "0 0% 95%",
      muted: "0 0% 12%",
      "muted-foreground": "0 0% 50%",
      accent: "0 0% 15%",
      "accent-foreground": "0 0% 95%",
      destructive: "0 72% 51%",
      "destructive-foreground": "0 0% 98%",
      border: "0 0% 15%",
      input: "0 0% 8%",
      ring: "0 0% 60%",
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

    // Apply all theme colors to CSS variables
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
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

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
