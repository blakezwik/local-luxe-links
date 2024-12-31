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

const handler = async (req: Request): Promise<Response> => {
  console.log("Welcome email function started");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, confirmLink } = await req.json();
    console.log("Sending welcome email to:", email);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "HostVibes <welcome@yourdomain.com>", // Update this with your verified domain
        to: [email],
        subject: "Welcome to HostVibes - Verify Your Email",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #177E89; text-align: center; font-size: 24px;">Welcome to HostVibes!</h1>
            <p style="color: #333; font-size: 16px; line-height: 1.5;">Hi ${name},</p>
            <p style="color: #333; font-size: 16px; line-height: 1.5;">Thank you for joining HostVibes! We're excited to have you on board.</p>
            <p style="color: #333; font-size: 16px; line-height: 1.5;">To get started, please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmLink}" 
                 style="background-color: #177E89; 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 4px; 
                        display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p style="color: #666; font-size: 14px; text-align: center;">
              If you didn't create this account, you can safely ignore this email.
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Error sending welcome email:", error);
      throw new Error(error);
    }

    const data = await res.json();
    console.log("Welcome email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in welcome email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);