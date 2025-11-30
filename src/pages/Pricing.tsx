import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$19",
    credits: "500",
    features: [
      "500 generation credits",
      "Basic game types",
      "Script generation",
      "UI components",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$49",
    credits: "1,500",
    features: [
      "1,500 generation credits",
      "All game types",
      "Advanced scripts",
      "Custom UI & assets",
      "Priority support",
      "Plugin access",
      "Version history",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    credits: "10,000",
    features: [
      "10,000 generation credits",
      "Unlimited game types",
      "Premium AI agents",
      "White-label option",
      "Dedicated support",
      "API access",
      "Team collaboration",
      "Custom integrations",
    ],
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Simple <span className="text-gradient-cyber">Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your game development needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <Card
              key={i}
              className={`glass border-border/50 p-8 relative hover:border-primary/50 transition-all animate-fade-in ${
                plan.popular ? "border-primary/50 scale-105" : ""
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-cyber rounded-full text-sm font-medium glow-primary">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl font-bold text-gradient-primary">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>{plan.credits} credits</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-gradient-cyber glow-primary"
                    : "bg-primary/10 border border-primary/30 hover:bg-primary/20"
                }`}
              >
                Get Started
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            All plans include one-click export and plugin access
          </p>
          <p className="text-sm text-muted-foreground">
            Need more credits? <span className="text-primary cursor-pointer hover:underline">Contact sales</span>
          </p>
        </div>
      </div>
    </div>
  );
}
