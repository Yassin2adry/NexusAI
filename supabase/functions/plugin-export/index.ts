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

    // Trigger export
    if (path.includes("/trigger") && req.method === "POST") {
      const { projectId, format } = await req.json();

      // Verify project ownership
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .eq("user_id", userId)
        .single();

      if (projectError || !project) {
        return new Response(
          JSON.stringify({ error: "Project not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create export record
      const { data: exportRecord, error: exportError } = await supabase
        .from("project_exports")
        .insert({
          project_id: projectId,
          user_id: userId,
          format: format || "rbxl",
          status: "processing",
        })
        .select()
        .single();

      if (exportError) throw exportError;

      // TODO: Implement actual export logic here
      // For now, we'll simulate it with a simple structure
      const exportData = {
        project: project.name,
        scripts: project.scripts,
        server_scripts: project.server_scripts,
        client_scripts: project.client_scripts,
        ui_components: project.ui_components,
        assets: project.assets,
      };

      // In production, this would generate actual RBXL/RBXLX files
      // and upload to storage, returning a download URL

      // Update export status
      await supabase
        .from("project_exports")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          download_url: `https://example.com/exports/${exportRecord.id}.${format}`,
        })
        .eq("id", exportRecord.id);

      return new Response(
        JSON.stringify({
          success: true,
          exportId: exportRecord.id,
          status: "processing",
          message: "Export started. Check status endpoint for updates.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get export status
    if (path.includes("/status/") && req.method === "GET") {
      const exportId = path.split("/status/")[1];

      const { data: exportRecord, error } = await supabase
        .from("project_exports")
        .select("*")
        .eq("id", exportId)
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ export: exportRecord }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // List exports for a project
    if (path.includes("/list/") && req.method === "GET") {
      const projectId = path.split("/list/")[1];

      const { data: exports, error } = await supabase
        .from("project_exports")
        .select("*")
        .eq("project_id", projectId)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return new Response(
        JSON.stringify({ exports }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in plugin-export:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
