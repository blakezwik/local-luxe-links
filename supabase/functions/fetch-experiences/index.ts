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

    const endpoint = 'https://api.viator.com/partner/products/search'
    console.log(`Testing endpoint: ${endpoint}`)
    
    // Search parameters based on documentation example
    const searchBody = {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      count: 10,
      currency: "USD",
      language: "en",
    }

    console.log('Making request with search parameters:', searchBody)
    console.log('Using headers:', {
      'Accept-Language': 'en-US',
      'Accept': 'application/json;version=2.0',
      'exp-api-key': '[MASKED]'
    })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept-Language': 'en-US',
        'Accept': 'application/json;version=2.0',
        'exp-api-key': VIATOR_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchBody)
    })

    console.log(`Response status: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      
      try {
        const errorJson = JSON.parse(errorText)
        throw new Error(`API error (${response.status}): ${JSON.stringify(errorJson)}`)
      } catch (parseError) {
        throw new Error(`API error (${response.status}): ${errorText}`)
      }
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