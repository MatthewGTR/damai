import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const action = pathParts[pathParts.length - 1];

    // POST: Create new update
    if (req.method === "POST" && action === "create") {
      const body = await req.json();
      const { admin_id, content, media_url, media_type } = body;

      const { data, error } = await supabase
        .from("updates")
        .insert({
          admin_id,
          content,
          media_url,
          media_type,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, data }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // PUT: Update existing post
    if (req.method === "PUT" && action === "update") {
      const body = await req.json();
      const { id, content, media_url, media_type } = body;

      const { data, error } = await supabase
        .from("updates")
        .update({
          content,
          media_url,
          media_type,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, data }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // POST: Change admin password
    if (req.method === "POST" && action === "change-password") {
      const body = await req.json();
      const { admin_id, current_password, new_password } = body;

      const { data: verifyResult, error: verifyError } = await supabase
        .rpc("verify_admin_password", {
          p_admin_id: admin_id,
          p_password: current_password
        });

      if (verifyError || !verifyResult) {
        throw new Error("Current password is incorrect");
      }

      const { data: updateResult, error: updateError } = await supabase
        .rpc("update_admin_password", {
          p_admin_id: admin_id,
          p_new_password: new_password
        });

      if (updateError) throw updateError;

      return new Response(JSON.stringify({ success: true }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // DELETE: Delete update
    if (req.method === "DELETE") {
      const body = await req.json();
      const { id } = body;

      const { error } = await supabase
        .from("updates")
        .delete()
        .eq("id", id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});