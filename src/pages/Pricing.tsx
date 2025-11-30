import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$19",
    credits: "500 credits/mo",
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
    credits: "1,500 credits/mo",
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
    credits: "10,000 credits/mo",
    features: [
      "10,000 generation credits",
      "Unlimited game types",
      "Premium AI models",
      "White-label option",
      "Dedicated support",
      "API access",
      "Team collaboration",
    ],
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        
        <div className="text-center mb-16 relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6">
            <Sparkles className="h-4 w-4 text-primary-glow" />
            <span className="text-sm text-muted-foreground">Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start building incredible games today with flexible pricing options
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
          {plans.map((plan, i) => (
            <Card
              key={i}
              className={`p-8 glass-panel relative transition-all duration-300 hover:scale-105 animate-fade-in ${
                plan.popular ? "glow-border" : "hover-glow"
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground rounded-full text-xs font-medium">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.credits}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                      <Check className="h-3 w-3 text-primary-glow" />
                    </div>
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular ? "hover-glow" : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                Get Started
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center text-sm text-muted-foreground relative z-10 animate-fade-in">
          <p>All plans include one-click export and plugin access</p>
        </div>
      </div>
    </div>
  );
}
