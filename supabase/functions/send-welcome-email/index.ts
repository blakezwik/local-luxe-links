import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  fullName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, fullName }: EmailRequest = await req.json();
    
    const signInUrl = new URL("/signin", req.url).href;
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #177E89; text-align: center; font-size: 28px;">Welcome to HostVibes!</h1>
        <p style="font-size: 16px; line-height: 1.5; color: #333;">
          Dear ${fullName},
        </p>
        <p style="font-size: 16px; line-height: 1.5; color: #333;">
          Thank you for joining HostVibes! We're excited to have you on board and can't wait to help you connect with local businesses and enhance your guests' experiences.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${signInUrl}?email=${encodeURIComponent(to)}" 
             style="background-color: #FFD166; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Sign In to Your Account
          </a>
        </div>
        <p style="font-size: 16px; line-height: 1.5; color: #333;">
          Best regards,<br>
          The HostVibes Team
        </p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "HostVibes <onboarding@resend.dev>",
        to: [to],
        subject: "Welcome to HostVibes! 🎉",
        html: emailContent,
      }),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);