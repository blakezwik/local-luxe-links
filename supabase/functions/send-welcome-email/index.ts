import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
  verificationToken: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Welcome email function started");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, verificationToken } = await req.json() as WelcomeEmailRequest;
    console.log("Received request to send welcome email to:", email);

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      throw new Error("RESEND_API_KEY is not set");
    }

    // For development/testing, use a different from address
    const fromEmail = email === "bzwikventure@gmail.com" 
      ? "GuestVibes <onboarding@resend.dev>"
      : "GuestVibes <welcome@guestvibes.com>";

    // Get the base URL from the request origin
    const baseUrl = req.headers.get("origin") || "";
    console.log("Base URL for verification link:", baseUrl);

    // Construct verification URL with the token from the signup response
    const verificationUrl = `${baseUrl}/auth/callback#access_token=${verificationToken}&type=signup`;
    console.log("Constructed verification URL (without token):", `${baseUrl}/auth/callback#type=signup`);

    const emailData = {
      from: fromEmail,
      to: [email],
      subject: "Welcome to GuestVibes - Please Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #177E89; text-align: center; font-size: 24px;">Welcome to GuestVibes!</h1>
          
          <p style="color: #333; font-size: 16px; line-height: 1.5;">Hi ${name.split(' ')[0]},</p>
          
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
            <a href="${verificationUrl}" 
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