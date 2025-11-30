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

    const { username } = await req.json();

    if (!username || username.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Username is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Verifying Roblox username: ${username}`);

    // Search for the user on Roblox (limit must be 10, 25, 50, or 100)
    const searchResponse = await fetch(
      `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username)}&limit=10`
    );

    if (!searchResponse.ok) {
      console.error("Roblox API error:", await searchResponse.text());
      return new Response(
        JSON.stringify({ error: "Failed to verify with Roblox API" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const searchData = await searchResponse.json();

    if (!searchData.data || searchData.data.length === 0) {
      return new Response(
        JSON.stringify({ error: "Roblox username not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const robloxUser = searchData.data[0];
    
    // Verify the username matches exactly (case-insensitive)
    if (robloxUser.name.toLowerCase() !== username.toLowerCase()) {
      return new Response(
        JSON.stringify({ error: "Roblox username not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Found Roblox user:`, robloxUser);

    // Get avatar
    const avatarResponse = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxUser.id}&size=150x150&format=Png`
    );

    let avatarUrl = null;
    if (avatarResponse.ok) {
      const avatarData = await avatarResponse.json();
      if (avatarData.data && avatarData.data.length > 0) {
        avatarUrl = avatarData.data[0].imageUrl;
        console.log(`Got avatar URL: ${avatarUrl}`);
      }
    }

    // Update user profile with verified Roblox data
    const { error: updateError } = await supabaseClient
      .from("profiles")
      .update({
        roblox_username: robloxUser.name,
        roblox_user_id: robloxUser.id.toString(),
        roblox_avatar_url: avatarUrl,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        robloxUser: {
          id: robloxUser.id,
          username: robloxUser.name,
          displayName: robloxUser.displayName,
          avatarUrl: avatarUrl,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in verify-roblox function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
