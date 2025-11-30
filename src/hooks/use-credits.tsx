import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export function useCredits() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const loadCredits = async () => {
    if (!user) {
      setCredits(0);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("credits")
        .select("amount")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setCredits(data?.amount || 0);
    } catch (error) {
      console.error("Error loading credits:", error);
      setCredits(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCredits();

    // Subscribe to credit changes
    if (user) {
      const channel = supabase
        .channel("credits-changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "credits",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setCredits(payload.new.amount);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return { credits, loading, refreshCredits: loadCredits };
}
