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

    console.log('Making test request to Viator Partner API using basic-access endpoint')
    
    // Using the /available/products endpoint which is accessible to basic-access affiliates
    const response = await fetch('https://api.viator.com/partner/available/products', {
      method: 'GET',
      headers: {
        'Accept-Language': 'en-US',
        'Accept': 'application/json;version=2.0',
        'Viator-API-Key': VIATOR_API_KEY
      }
    })

    console.log('Viator API response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Viator API error response:', errorText)
      
      // Check if it's an access level issue
      if (errorText.includes('access') || errorText.includes('permission')) {
        throw new Error(`API access level error: ${errorText}. This endpoint might not be available for basic-access affiliates.`)
      }
      
      throw new Error(`API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    console.log('Response data:', JSON.stringify(data, null, 2))

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully connected to Viator API using basic-access endpoint. Found ${data.products?.length || 0} available products.`,
        data: data
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
        message: "Failed to fetch experiences: " + error.message,
        details: "This might be due to API access level restrictions. Please check if this endpoint is available for basic-access affiliates."
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})