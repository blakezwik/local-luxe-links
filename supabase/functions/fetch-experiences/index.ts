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
    console.log('Starting Viator Basic Access API test')
    
    const VIATOR_API_KEY = Deno.env.get('VIATOR_API_KEY')
    if (!VIATOR_API_KEY) {
      throw new Error('Missing Viator API key')
    }

    // Basic Access endpoints as per documentation
    const endpoints = [
      'https://api.viator.com/partner/products/available',
      'https://api.viator.com/partner/products/codes'
    ]
    
    let successfulEndpoint = null
    let responseData = null

    // Try each endpoint until we find one that works
    for (const endpoint of endpoints) {
      console.log(`Testing endpoint: ${endpoint}`)
      
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept-Language': 'en-US',
            'Accept': 'application/json;version=2.0',
            'Viator-API-Key': VIATOR_API_KEY
          }
        })

        console.log(`Response status for ${endpoint}:`, response.status)
        
        if (response.ok) {
          responseData = await response.json()
          successfulEndpoint = endpoint
          console.log('Successfully connected to endpoint:', endpoint)
          break
        } else {
          const errorText = await response.text()
          console.log(`Error for ${endpoint}:`, errorText)
        }
      } catch (error) {
        console.error(`Error testing ${endpoint}:`, error)
      }
    }

    if (!successfulEndpoint) {
      throw new Error('Unable to connect to any Basic Access endpoints')
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully connected to Viator API using Basic Access endpoint: ${successfulEndpoint}`,
        data: responseData,
        accessLevel: 'basic',
        limitations: [
          'Direct booking not available',
          'Real-time pricing limited',
          'Basic product information only'
        ]
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
        details: "This error occurred while testing Basic Access endpoints. Please ensure you have proper Basic Access credentials.",
        documentation: "https://partnerresources.viator.com/travel-commerce/affiliate/basic-access/golden-path/"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})