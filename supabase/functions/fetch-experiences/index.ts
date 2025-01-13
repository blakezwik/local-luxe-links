import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting Viator API connection test')
    
    const VIATOR_API_KEY = Deno.env.get('VIATOR_API_KEY')
    if (!VIATOR_API_KEY) {
      throw new Error('Missing Viator API key')
    }

    console.log('Making test request to Viator Affiliate API')
    
    // Simple test request to the Viator API
    const response = await fetch('https://api.viator.com/partner/products/search', {
      method: 'POST',
      headers: {
        'Accept-Language': 'en-US',
        'Accept': 'application/json;version=2.0',
        'Content-Type': 'application/json',
        'exp-api-key': VIATOR_API_KEY  // Changed from 'api-key' to 'exp-api-key'
      },
      body: JSON.stringify({
        "count": 1  // Just request 1 product to test the connection
      })
    })

    console.log('Viator API response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Viator API error response:', errorText)
      throw new Error(`API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    console.log('Response data:', JSON.stringify(data, null, 2))

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully connected to Viator API. Found ${data.products?.length || 0} products.`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in fetch-experiences:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "Failed to fetch experiences: " + error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})