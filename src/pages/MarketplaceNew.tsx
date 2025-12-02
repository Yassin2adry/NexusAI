import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Package, 
  Code, 
  Layout, 
  Sparkles, 
  Download, 
  Star,
  Search,
  TrendingUp,
  Clock,
  Upload
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  rating: number;
  downloads: number;
  user_id: string;
  content: any;
  preview_image?: string;
  created_at: string;
}

export default function MarketplaceNew() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingItemId, setPurchasingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    loadMarketplaceItems();
  }, []);

  const loadMarketplaceItems = async () => {
    try {
      const { data, error } = await supabase
        .from("marketplace_items")
        .select("*")
        .eq("status", "approved")
        .order("downloads", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error loading marketplace items:", error);
      toast.error("Failed to load marketplace items");
    } finally {
      setLoading(false);
    }
  };

  const purchaseItem = async (itemId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("marketplace-purchase", {
        body: { itemId },
      });

      if (error) throw error;

      if (data.error) {
        if (data.error === "Insufficient credits") {
          toast.error("Insufficient credits. Please purchase more credits.");
        } else if (data.error === "Already purchased") {
          toast.info("You've already purchased this item!");
        } else {
          toast.error(data.error);
        }
        return;
      }

      toast.success("Item purchased successfully!");
      loadMarketplaceItems();
    } catch (error: any) {
      console.error("Error purchasing item:", error);
      toast.error(error.message || "Failed to purchase item");
    } finally {
      setPurchasingItemId(null);
    }
  };

  const filteredItems = items.filter(item => 
    (selectedCategory === "all" || item.type === selectedCategory) &&
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getIconForType = (type: string) => {
    switch (type) {
      case "script": return Code;
      case "ui": return Layout;
      case "module": return Package;
      case "effects": return Sparkles;
      default: return Package;
    }
  };

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

          {loading ? (
            <Card className="p-12 glass-panel text-center">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground mt-4">Loading marketplace...</p>
            </Card>
          ) : (
            <>
              {/* Marketplace Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredItems.map((item) => {
                  const ItemIcon = getIconForType(item.type);
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

                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span>{item.rating.toFixed(1)}</span>
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
                        <Button 
                          size="sm" 
                          className="gap-2"
                          onClick={() => setPurchasingItemId(item.id)}
                          disabled={purchasingItemId === item.id}
                        >
                          {purchasingItemId === item.id ? (
                            <>
                              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              Purchasing...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              Get
                            </>
                          )}
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
                  <div className="text-3xl font-bold mb-1">{items.length}</div>
                  <div className="text-sm text-muted-foreground">Total Assets</div>
                </Card>
                <Card className="p-6 glass-panel text-center">
                  <Download className="h-8 w-8 mx-auto mb-3 text-primary-glow" />
                  <div className="text-3xl font-bold mb-1">
                    {items.reduce((sum, item) => sum + item.downloads, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Downloads</div>
                </Card>
                <Card className="p-6 glass-panel text-center">
                  <Clock className="h-8 w-8 mx-auto mb-3 text-primary-glow" />
                  <div className="text-3xl font-bold mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Updated Daily</div>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Purchase Confirmation Dialog */}
      <AlertDialog open={!!purchasingItemId} onOpenChange={(open) => !open && setPurchasingItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Purchase Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to purchase this item? Credits will be deducted from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => purchasingItemId && purchaseItem(purchasingItemId)}
            >
              Confirm Purchase
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}