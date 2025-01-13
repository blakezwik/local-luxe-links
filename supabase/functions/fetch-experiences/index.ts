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
    console.log('Starting to fetch experiences from Viator Affiliate API')
    
    const VIATOR_API_KEY = Deno.env.get('VIATOR_API_KEY')
    if (!VIATOR_API_KEY) {
      throw new Error('Missing Viator API key')
    }

    // Log API request details
    console.log('Making request to Viator Affiliate API')
    
    // Parameters for the affiliate API search
    const searchParams = {
      "startDate": new Date().toISOString().split('T')[0],
      "endDate": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "count": 10,
      "currency": "USD"
    }

    // Using the affiliate API endpoint
    const response = await fetch('https://api.viator.com/partner/products/search', {
      method: 'POST',
      headers: {
        'Accept-Language': 'en-US',
        'Accept': 'application/json;version=2.0',
        'Content-Type': 'application/json',
        'exp-api-key': VIATOR_API_KEY
      },
      body: JSON.stringify(searchParams)
    })

    console.log('Viator API response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Viator API error response:', errorText)
      
      // Handle specific error cases
      switch (response.status) {
        case 401:
          throw new Error('Invalid API key. Please verify your Viator API key.')
        case 403:
          throw new Error('Access forbidden. Your API key might not have the required permissions.')
        case 429:
          throw new Error('Rate limit exceeded. Please try again later.')
        default:
          throw new Error(`API error (${response.status}): ${errorText}`)
      }
    }

    const data = await response.json()
    console.log('Response data:', JSON.stringify(data, null, 2))

    if (!data?.products) {
      console.error('Invalid response structure:', JSON.stringify(data))
      throw new Error('Invalid response structure from Viator API')
    }

    const experiences = data.products.map((product: any) => ({
      id: crypto.randomUUID(),
      viator_id: product.productCode || product.code,
      title: product.title,
      description: product.description || product.shortDescription || null,
      price: product.pricing?.fromPrice || null,
      image_url: product.primaryPhotoUrl || product.thumbnailUrl || null,
      destination: product.destination?.name || null
    }))

    console.log(`Successfully transformed ${experiences.length} experiences`)

    return new Response(
      JSON.stringify({ 
        experiences,
        message: experiences.length > 0 
          ? `Found ${experiences.length} experiences`
          : 'No experiences found for the current search criteria.'
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