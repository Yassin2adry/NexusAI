import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";
import { TrendingUp, TrendingDown, Award, Gift, ArrowUpDown } from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  type: "earned" | "spent" | "awarded" | "refunded";
  reason: string;
  created_at: string;
}

export const CreditsHistory = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("credits_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions((data || []) as Transaction[]);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "earned":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "spent":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "awarded":
        return <Award className="h-4 w-4 text-yellow-500" />;
      case "refunded":
        return <Gift className="h-4 w-4 text-blue-500" />;
      default:
        return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case "earned":
      case "awarded":
      case "refunded":
        return "text-green-500";
      case "spent":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 gradient-text">Credits History</h2>
      
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <ArrowUpDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No transactions yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Your credit history will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-full bg-background">
                  {getIcon(transaction.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{transaction.reason}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className={`text-lg font-bold ${getAmountColor(transaction.type)}`}>
                {transaction.amount > 0 ? "+" : ""}
                {transaction.amount}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
