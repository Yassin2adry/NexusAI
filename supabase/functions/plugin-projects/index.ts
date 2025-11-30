import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-plugin-token",
};

const validateToken = async (supabase: any, token: string | null) => {
  if (!token) {
    return { valid: false, userId: null };
  }

  const { data, error } = await supabase.rpc("validate_plugin_token", {
    p_token: token,
  });

  if (error || !data || data.length === 0 || !data[0].is_valid) {
    return { valid: false, userId: null };
  }

  return { valid: true, userId: data[0].user_id };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const pluginToken = req.headers.get("x-plugin-token");

  try {
    // Validate token
    const { valid, userId } = await validateToken(supabase, pluginToken);
    if (!valid) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const path = new URL(req.url).pathname;

    // List projects
    if (path.includes("/list") && req.method === "GET") {
      const { data: projects, error } = await supabase
        .from("projects")
        .select("id, name, type, status, created_at, updated_at")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      return new Response(
        JSON.stringify({ projects }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get project details
    if (path.includes("/get/") && req.method === "GET") {
      const projectId = path.split("/get/")[1];

      const { data: project, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ project }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create project
    if (path.includes("/create") && req.method === "POST") {
      const { name, type, prompt } = await req.json();

      const { data: project, error } = await supabase
        .from("projects")
        .insert({
          user_id: userId,
          name,
          type,
          prompt,
          status: "in-progress",
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ project }),
        { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update project
    if (path.includes("/update/") && req.method === "PUT") {
      const projectId = path.split("/update/")[1];
      const updates = await req.json();

      const { data: project, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", projectId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ project }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Delete project
    if (path.includes("/delete/") && req.method === "DELETE") {
      const projectId = path.split("/delete/")[1];

      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)
        .eq("user_id", userId);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in plugin-projects:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
