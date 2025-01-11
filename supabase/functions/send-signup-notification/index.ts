import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SignupNotification {
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const signupRequest: SignupNotification = await req.json();
    
    // Get user profile information
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name, state, city')
      .eq('id', signupRequest.userId)
      .single();

    if (!profile) {
      throw new Error("User profile not found");
    }

    console.log("Sending signup notification for profile:", profile);

    const toEmail = "contact@guestvibes.com";
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "GuestVibes Notifications <notifications@guestvibes.com>",
        to: [toEmail],
        subject: `New User Signup: ${profile.full_name}`,
        html: `
          <h2>New User Registration</h2>
          <p><strong>Name:</strong> ${profile.full_name}</p>
          <p><strong>Email:</strong> ${profile.email}</p>
          <p><strong>Location:</strong> ${profile.city ? `${profile.city}, ` : ''}${profile.state}</p>
          <p><strong>Signup Date:</strong> ${new Date().toLocaleString()}</p>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(errorData);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in send-signup-notification function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);