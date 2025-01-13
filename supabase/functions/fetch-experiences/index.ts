import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting Viator Basic Access API test')
    
    const VIATOR_API_KEY = Deno.env.get('VIATOR_API_KEY')
    if (!VIATOR_API_KEY) {
      throw new Error('Missing Viator API key')
    }

    // Using the basic access endpoint for product search
    const endpoint = 'https://api.viator.com/partner/products/search'
    console.log(`Testing endpoint: ${endpoint}`)
    
    // Basic search parameters for testing
    const searchBody = {
      startDate: new Date().toISOString().split('T')[0], // Today's date
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      count: 10 // Limit results for testing
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept-Language': 'en-US',
        'Accept': 'application/json;version=2.0',
        'Viator-API-Key': VIATOR_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchBody)
    })

    console.log(`Response status: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error(`API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    console.log('Successfully retrieved products:', data.data?.length || 0)

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully connected to Viator API and retrieved ${data.data?.length || 0} products`,
        data: data,
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