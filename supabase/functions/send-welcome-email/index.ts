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

    const emailData = {
      from: "GuestVibes <welcome@guestvibes.com>",
      to: [email],
      subject: "Welcome to GuestVibes!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #177E89; font-size: 28px; margin-bottom: 10px;">Welcome to GuestVibes!</h1>
            <p style="color: #666; font-size: 16px;">Your journey to better hosting starts here</p>
          </div>
          
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin: 20px 0;">
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 0;">
              Hi ${name.split(' ')[0]},
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Thank you for joining GuestVibes! We're excited to have you on board and help you enhance your guests' experience through local partnerships.
            </p>
          </div>

          <div style="margin: 30px 0;">
            <h2 style="color: #177E89; font-size: 20px; margin-bottom: 15px;">Getting Started</h2>
            <ol style="color: #333; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>Complete your host profile with details about your property</li>
              <li>Browse our curated list of local businesses in your area</li>
              <li>Start creating memorable experiences for your guests</li>
            </ol>
          </div>

          <div style="background-color: #177E89; color: white; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="margin: 0; font-size: 16px;">
              Ready to explore? Visit your dashboard to get started!
            </p>
          </div>

          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="color: #666; font-size: 14px; margin: 5px 0;">
              Need help? Contact our support team at support@guestvibes.com
            </p>
            <p style="color: #666; font-size: 12px; margin: 5px 0;">
              © ${new Date().getFullYear()} GuestVibes. All rights reserved.
            </p>
          </div>
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