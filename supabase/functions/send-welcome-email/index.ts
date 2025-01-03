import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
  confirmLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Welcome email function started");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json() as WelcomeEmailRequest;
    console.log("Received request to send welcome email to:", email);

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      throw new Error("RESEND_API_KEY is not set");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Supabase environment variables are not set");
      throw new Error("Supabase environment variables are not set");
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Generate email verification link
    const { data: { user }, error: verificationError } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: email,
    });

    if (verificationError || !user) {
      console.error("Error generating verification link:", verificationError);
      throw verificationError || new Error("Failed to generate verification link");
    }

    console.log("Preparing to send email with Resend");
    const firstName = name.split(' ')[0];

    const emailData = {
      from: "GuestVibes <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to GuestVibes - Please Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #177E89; text-align: center; font-size: 24px;">Welcome to GuestVibes!</h1>
          
          <p style="color: #333; font-size: 16px; line-height: 1.5;">Hi ${firstName},</p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.5;">
            Thank you for joining GuestVibes! We're excited to have you on board and can't wait to help you connect with local businesses in your area.
          </p>

          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h2 style="color: #177E89; font-size: 18px; margin-top: 0;">Next Steps:</h2>
            <ol style="color: #333; font-size: 16px; line-height: 1.5; margin: 0; padding-left: 20px;">
              <li>Verify your email address (click the button below)</li>
              <li>Complete your host profile</li>
              <li>Start exploring local partnership opportunities</li>
            </ol>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${user.confirmation_token}" 
               style="background-color: #177E89; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 4px; 
                      display: inline-block;
                      font-weight: bold;">
              Verify Email Address
            </a>
          </div>

          <p style="color: #666; font-size: 14px; text-align: center;">
            If you didn't create this account, you can safely ignore this email.
          </p>
        </div>
      `
    };

    console.log("Making request to Resend API");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailData),
    });

    const responseText = await res.text();
    console.log("Resend API response status:", res.status);
    console.log("Resend API response:", responseText);

    if (res.ok) {
      console.log("Email sent successfully");
      return new Response(responseText, {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      console.error("Error from Resend API:", responseText);
      return new Response(JSON.stringify({ error: responseText }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("Error in welcome email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);