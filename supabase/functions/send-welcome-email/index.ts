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

interface EmailData {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

const generateEmailTemplate = (name: string): string => {
  const dashboardUrl = "https://preview--local-luxe-links.lovable.app";
  
  return `
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
          <li>Browse the list of local businesses in your area</li>
          <li>Generate your personalized host link to share with your guests</li>
          <li>Sit back as they begin booking and get rewarded</li>
        </ol>
      </div>

      <div style="background-color: #177E89; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
        <a href="${dashboardUrl}/signin" style="color: white; text-decoration: none; display: block; font-size: 16px;">
          Ready to explore? Sign in to your dashboard!
        </a>
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
  `;
};

const createEmailData = (email: string, name: string): EmailData => {
  return {
    from: "GuestVibes <welcome@guestvibes.com>",
    to: [email],
    subject: "Welcome to GuestVibes!",
    html: generateEmailTemplate(name)
  };
};

const sendEmail = async (emailData: EmailData): Promise<Response> => {
  console.log("Making request to Resend API");
  
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    throw new Error("RESEND_API_KEY is not set");
  }

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

  if (!res.ok) {
    console.error("Error from Resend API:", responseText);
    throw new Error(responseText);
  }

  return new Response(responseText, {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
};

const handleError = (error: unknown): Response => {
  console.error("Error in welcome email function:", error);
  const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
  
  return new Response(JSON.stringify({ error: errorMessage }), {
    status: 500,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Welcome email function started");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json() as WelcomeEmailRequest;
    console.log("Received request to send welcome email to:", email);

    const emailData = createEmailData(email, name);
    return await sendEmail(emailData);
  } catch (error) {
    return handleError(error);
  }
};

serve(handler);