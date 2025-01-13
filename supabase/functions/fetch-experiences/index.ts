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

    // Debug API key format
    console.log('API Key validation:')
    console.log('- Length:', VIATOR_API_KEY.length)
    console.log('- Contains hyphens:', VIATOR_API_KEY.includes('-'))
    console.log('- Has whitespace:', VIATOR_API_KEY !== VIATOR_API_KEY.trim())

    const endpoint = 'https://api.viator.com/partner/products/search'
    console.log(`Endpoint: ${endpoint}`)

    // Using Exp-Api-Key with capital letters as shown in Viator's documentation
    const headers = {
      'Exp-Api-Key': VIATOR_API_KEY.trim(),
      'Accept': 'application/json;version=2.0',
      'Accept-Language': 'en-US',
      'Content-Type': 'application/json'
    }

    // Log the exact request configuration (for Postman comparison)
    console.log('=== REQUEST CONFIGURATION ===')
    console.log('Method: POST')
    console.log('URL:', endpoint)
    console.log('Headers:', {
      'Accept': headers.Accept,
      'Accept-Language': headers['Accept-Language'],
      'Content-Type': headers['Content-Type'],
      // Not logging the full API key, just length for security
      'Exp-Api-Key': `[Key length: ${headers['Exp-Api-Key'].length}]`
    })

    const searchBody = {
      "sortOrder": "RECOMMENDED",
      "currency": "USD"
    }

    console.log('Request Body:', JSON.stringify(searchBody, null, 2))

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