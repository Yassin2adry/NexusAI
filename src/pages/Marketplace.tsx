import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Code, 
  Layout, 
  Sparkles, 
  Download, 
  Star,
  Search,
  TrendingUp,
  Clock
} from "lucide-react";
import { useState } from "react";

const marketplaceItems = [
  {
    id: 1,
    name: "Advanced Inventory System",
    type: "script",
    description: "Complete inventory management with UI, drag-drop, and persistence",
    creator: "DevMaster",
    price: 25,
    rating: 4.8,
    downloads: 342,
    icon: Code,
  },
  {
    id: 2,
    name: "Modern Shop UI Pack",
    type: "ui",
    description: "Sleek shop interface with animations and sound effects",
    creator: "UIProDesigns",
    price: 15,
    rating: 4.9,
    downloads: 521,
    icon: Layout,
  },
  {
    id: 3,
    name: "Combat System Module",
    type: "module",
    description: "Full combat framework with weapons, damage, and effects",
    creator: "CombatKing",
    price: 30,
    rating: 4.7,
    downloads: 289,
    icon: Package,
  },
  {
    id: 4,
    name: "Particle Effects Pack",
    type: "effects",
    description: "50+ premium particle effects for abilities and attacks",
    creator: "FXMaster",
    price: 20,
    rating: 5.0,
    downloads: 412,
    icon: Sparkles,
  },
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems = marketplaceItems.filter(item => 
    (selectedCategory === "all" || item.type === selectedCategory) &&
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-12 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6">
              <Package className="h-4 w-4 text-primary-glow" />
              <span className="text-sm text-muted-foreground">Community Assets</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
              Marketplace
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse and download AI-generated assets from the community
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="p-6 glass-panel mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
                <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="script">Scripts</TabsTrigger>
                  <TabsTrigger value="ui">UI Packs</TabsTrigger>
                  <TabsTrigger value="module">Modules</TabsTrigger>
                  <TabsTrigger value="effects">Effects</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </Card>

          {/* Marketplace Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredItems.map((item) => {
              const ItemIcon = item.icon;
              return (
                <Card key={item.id} className="p-6 glass-panel hover-glow transition-all hover:scale-105 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <ItemIcon className="h-6 w-6 text-primary-glow" />
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {item.type}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary-glow transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <span>by {item.creator}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span>{item.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Download className="h-4 w-4" />
                      <span>{item.downloads}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary-glow" />
                      <span className="font-semibold">{item.price} credits</span>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Get
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <Card className="p-12 glass-panel text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground text-lg">No assets found matching your search</p>
            </Card>
          )}

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 glass-panel text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-primary-glow" />
              <div className="text-3xl font-bold mb-1">1,247</div>
              <div className="text-sm text-muted-foreground">Total Assets</div>
            </Card>
            <Card className="p-6 glass-panel text-center">
              <Download className="h-8 w-8 mx-auto mb-3 text-primary-glow" />
              <div className="text-3xl font-bold mb-1">15,342</div>
              <div className="text-sm text-muted-foreground">Downloads</div>
            </Card>
            <Card className="p-6 glass-panel text-center">
              <Clock className="h-8 w-8 mx-auto mb-3 text-primary-glow" />
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Updated Daily</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
