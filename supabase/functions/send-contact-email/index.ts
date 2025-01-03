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

interface ContactRequest {
  message: string;
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const contactRequest: ContactRequest = await req.json();
    
    // Get user profile information
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', contactRequest.userId)
      .single();

    if (!profile) {
      throw new Error("User profile not found");
    }

    console.log("Sending email with profile:", profile);

    // In development/test mode, we can only send to the verified email
    const toEmail = "bzwikventure@gmail.com"; // Hardcoded for testing

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "GuestVibes Contact <onboarding@resend.dev>",
        to: [toEmail],
        subject: `Contact Form Submission from ${profile.full_name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${profile.full_name} (${profile.email})</p>
          <p><strong>Message:</strong></p>
          <p>${contactRequest.message}</p>
          <p><em>Note: This is a test email. In production, this would be sent to contact@guestvibes.com</em></p>
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
    console.error("Error in send-contact-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);