import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { itemId, rating, review } = await req.json();

    if (!itemId || !rating || rating < 1 || rating > 5) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user purchased this item
    const { data: purchase } = await supabaseClient
      .from("marketplace_purchases")
      .select("*")
      .eq("user_id", user.id)
      .eq("item_id", itemId)
      .single();

    if (!purchase) {
      return new Response(
        JSON.stringify({ error: "You must purchase this item before rating" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Upsert rating
    const { error: ratingError } = await supabaseClient
      .from("marketplace_ratings")
      .upsert({
        user_id: user.id,
        item_id: itemId,
        rating,
        review,
      });

    if (ratingError) throw ratingError;

    // Recalculate item's average rating
    const { data: ratings } = await supabaseClient
      .from("marketplace_ratings")
      .select("rating")
      .eq("item_id", itemId);

    if (ratings) {
      const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
      
      await supabaseClient
        .from("marketplace_items")
        .update({
          rating: Math.round(avgRating * 10) / 10,
          total_ratings: ratings.length,
        })
        .eq("id", itemId);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in marketplace-rate:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});