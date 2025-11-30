import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Credit costs for different task types and AI modes
const CREDIT_COSTS = {
  chat_message: 1,
  project_generation: 10,
  script_generation: 5,
  ui_generation: 3,
  asset_generation: 2,
};

// AI mode configurations
const AI_MODES = {
  fast: {
    name: "Fast Mode",
    model: "google/gemini-2.5-flash-lite",
    creditMultiplier: 1,
    description: "Quick responses for simple questions"
  },
  balanced: {
    name: "Balanced Mode",
    model: "google/gemini-2.5-flash",
    creditMultiplier: 1,
    description: "Default mode with good balance"
  },
  advanced: {
    name: "Advanced Mode",
    model: "google/gemini-2.5-pro",
    creditMultiplier: 2,
    description: "Deeper analysis and better reasoning"
  },
  expert: {
    name: "Expert Mode",
    model: "google/gemini-2.5-pro",
    creditMultiplier: 2,
    description: "Maximum intelligence for complex tasks"
  }
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

    const { chatSessionId, message, taskType = "chat_message", aiMode = "balanced" } = await req.json();

    if (!chatSessionId || !message) {
      return new Response(JSON.stringify({ error: "Missing chatSessionId or message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const mode = AI_MODES[aiMode as keyof typeof AI_MODES] || AI_MODES.balanced;
    const baseCost = CREDIT_COSTS[taskType as keyof typeof CREDIT_COSTS] || CREDIT_COSTS.chat_message;
    const creditCost = baseCost * mode.creditMultiplier;

    // Check if user has sufficient credits
    const { data: creditsCheck } = await supabaseClient.rpc("has_sufficient_credits", {
      p_user_id: user.id,
      p_amount: creditCost,
    });

    if (!creditsCheck) {
      return new Response(JSON.stringify({ 
        error: "Insufficient credits",
        required: creditCost 
      }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create task record
    const { data: task, error: taskError } = await supabaseClient
      .from("tasks")
      .insert({
        user_id: user.id,
        type: taskType,
        status: "processing",
        credits_cost: creditCost,
        input_data: { message, chatSessionId },
      })
      .select()
      .single();

    if (taskError) {
      console.error("Error creating task:", taskError);
      return new Response(JSON.stringify({ error: "Failed to create task" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify chat session belongs to user
    const { data: session, error: sessionError } = await supabaseClient
      .from("chat_sessions")
      .select("*")
      .eq("id", chatSessionId)
      .single();

    if (sessionError || !session || session.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Chat session not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save user message
    const { error: userMsgError } = await supabaseClient
      .from("chat_messages")
      .insert({
        chat_session_id: chatSessionId,
        role: "user",
        content: message,
      });

    if (userMsgError) {
      console.error("Error saving user message:", userMsgError);
      await supabaseClient.from("tasks").update({
        status: "failed",
        error_message: "Failed to save user message",
        completed_at: new Date().toISOString(),
      }).eq("id", task.id);
      throw userMsgError;
    }

    // Get conversation history
    const { data: messages, error: messagesError } = await supabaseClient
      .from("chat_messages")
      .select("role, content")
      .eq("chat_session_id", chatSessionId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
      throw messagesError;
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Call Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: mode.model,
        messages: [
          {
            role: "system",
            content: `You are NexusAI, an advanced AI assistant specialized in Roblox game development. You help users design, plan, and create Roblox games by:

1. **Understanding Game Ideas**: Ask clarifying questions about genre, target audience, and core gameplay
2. **Design Documents**: Create structured game design documents with clear sections
3. **Game Mechanics**: Suggest innovative mechanics, balance systems, and progression loops
4. **Luau Scripting**: Provide clean, optimized code examples with detailed comments
5. **UI/UX Design**: Recommend modern, accessible interface designs
6. **Asset Organization**: Structure projects with proper folders and naming conventions

**Special Features**:
- Proactively suggest improvements and alternatives
- Provide beginner-friendly explanations when needed
- Recommend popular Roblox libraries and tools
- Share best practices for performance and security
- Offer creative variations on user ideas

**Communication Style**:
- Be enthusiastic and encouraging
- Break down complex topics into digestible steps
- Use examples from successful Roblox games when relevant
- Always provide actionable, implementable advice

When users seem stuck or unsure, offer 2-3 concrete recommendations to get them started.`,
          },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      await supabaseClient.from("tasks").update({
        status: "failed",
        error_message: `AI API error: ${response.status}`,
        completed_at: new Date().toISOString(),
      }).eq("id", task.id);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please contact support." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    // Save assistant message
    const { error: assistantMsgError } = await supabaseClient
      .from("chat_messages")
      .insert({
        chat_session_id: chatSessionId,
        role: "assistant",
        content: assistantMessage,
      });

    if (assistantMsgError) {
      console.error("Error saving assistant message:", assistantMsgError);
      await supabaseClient.from("tasks").update({
        status: "failed",
        error_message: "Failed to save AI response",
        completed_at: new Date().toISOString(),
      }).eq("id", task.id);
      throw assistantMsgError;
    }

    // Update task as successful and deduct credits
    const { error: deductError } = await supabaseClient.rpc("deduct_credits", {
      p_user_id: user.id,
      p_task_id: task.id,
      p_amount: creditCost,
    });

    if (deductError) {
      console.error("Error deducting credits:", deductError);
    }

    await supabaseClient.from("tasks").update({
      status: "completed",
      output_data: { response: assistantMessage },
      completed_at: new Date().toISOString(),
    }).eq("id", task.id);

    // Update chat session timestamp
    await supabaseClient
      .from("chat_sessions")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", chatSessionId);

    return new Response(JSON.stringify({ 
      success: true,
      taskId: task.id,
      creditsUsed: creditCost,
      message: assistantMessage,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-chat function:", error);
    
    // Try to mark task as failed if we have the task ID
    try {
      const { chatSessionId } = await req.json();
      if (chatSessionId) {
        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_ANON_KEY") ?? "",
          {
            global: {
              headers: { Authorization: req.headers.get("Authorization")! },
            },
          }
        );
        // This is a best-effort attempt, may fail if task wasn't created
      }
    } catch (e) {
      // Ignore cleanup errors
    }

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
