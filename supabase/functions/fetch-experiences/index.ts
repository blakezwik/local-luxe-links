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
    console.log('Starting Viator API request')
    
    const VIATOR_API_KEY = Deno.env.get('VIATOR_API_KEY')
    if (!VIATOR_API_KEY) {
      throw new Error('Missing Viator API key')
    }

    // Validate API key format (should be a non-empty string without spaces)
    if (VIATOR_API_KEY.trim() !== VIATOR_API_KEY) {
      throw new Error('API key contains leading or trailing spaces')
    }

    console.log('API Key validation passed')
    console.log('API Key length:', VIATOR_API_KEY.length)

    const endpoint = 'https://api.viator.com/partner/products/search'
    console.log(`Endpoint: ${endpoint}`)

    // Headers exactly as specified in Viator documentation
    const headers = {
      'exp-api-key': VIATOR_API_KEY,
      'Accept': 'application/json;version=2.0',
      'Accept-Language': 'en-US',
      'Content-Type': 'application/json'
    }

    // Basic search body for initial testing
    const searchBody = {
      "sortOrder": "RECOMMENDED",
      "currency": "USD"
    }

    console.log('Request headers:', {
      ...headers,
      'exp-api-key': '[MASKED]'
    })
    console.log('Request body:', JSON.stringify(searchBody, null, 2))

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(searchBody)
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    const responseText = await response.text()
    console.log('Raw response:', responseText)
    
    if (!response.ok) {
      try {
        const errorJson = JSON.parse(responseText)
        throw new Error(`API error (${response.status}): ${JSON.stringify(errorJson)}`)
      } catch (parseError) {
        throw new Error(`API error (${response.status}): ${responseText}`)
      }
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (error) {
      console.error('Failed to parse JSON response:', error)
      throw new Error('Invalid JSON response from Viator API')
    }

    console.log('Successfully retrieved products:', data.data?.length || 0)

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully retrieved ${data.data?.length || 0} experiences`,
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
        message: "Failed to fetch experiences: " + error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})