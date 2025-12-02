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

    const { itemId } = await req.json();

    if (!itemId) {
      return new Response(JSON.stringify({ error: "Missing itemId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get item details
    const { data: item, error: itemError } = await supabaseClient
      .from("marketplace_items")
      .select("*")
      .eq("id", itemId)
      .eq("status", "approved")
      .single();

    if (itemError || !item) {
      return new Response(JSON.stringify({ error: "Item not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if already purchased
    const { data: existingPurchase } = await supabaseClient
      .from("marketplace_purchases")
      .select("*")
      .eq("user_id", user.id)
      .eq("item_id", itemId)
      .single();

    if (existingPurchase) {
      return new Response(JSON.stringify({ error: "Already purchased" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check credits
    const { data: credits } = await supabaseClient
      .from("credits")
      .select("amount")
      .eq("user_id", user.id)
      .single();

    if (!credits || credits.amount < item.price) {
      return new Response(JSON.stringify({ error: "Insufficient credits" }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Deduct credits
    const { error: deductError } = await supabaseClient
      .from("credits")
      .update({ amount: credits.amount - item.price })
      .eq("user_id", user.id);

    if (deductError) throw deductError;

    // Create purchase record
    const { error: purchaseError } = await supabaseClient
      .from("marketplace_purchases")
      .insert({
        user_id: user.id,
        item_id: itemId,
        credits_spent: item.price,
      });

    if (purchaseError) throw purchaseError;

    // Log transaction
    await supabaseClient
      .from("credits_transactions")
      .insert({
        user_id: user.id,
        amount: -item.price,
        type: "spent",
        reason: `Marketplace purchase: ${item.name}`,
      });

    // Update download count
    await supabaseClient
      .from("marketplace_items")
      .update({ downloads: item.downloads + 1 })
      .eq("id", itemId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        item: item,
        creditsRemaining: credits.amount - item.price 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in marketplace-purchase:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});