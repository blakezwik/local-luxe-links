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
    console.log('Starting to fetch popular experiences')
    
    const VIATOR_API_KEY = Deno.env.get('VIATOR_API_KEY')
    if (!VIATOR_API_KEY) {
      console.error('Missing Viator API key')
      throw new Error('Missing Viator API key')
    }

    // Log key details for debugging (safely)
    console.log('API Key present:', !!VIATOR_API_KEY)
    console.log('API Key length:', VIATOR_API_KEY.length)
    console.log('First 4 chars of API key:', VIATOR_API_KEY.substring(0, 4))
    
    // Clean the API key
    const cleanApiKey = VIATOR_API_KEY.trim()

    console.log('Making request to Viator API...')
    
    // Search parameters according to Viator V2 API documentation
    const searchParams = {
      "status": "AVAILABLE",
      "count": 20, // Limit to 20 experiences
      "sortOrder": "TOP_SELLERS", // Sort by most popular
      "currencyCode": "USD",
      "language": "en"
    }

    const response = await fetch('https://api.viator.com/partner/products/search', {
      method: 'POST',
      headers: {
        'exp-api-key': cleanApiKey,
        'Accept': 'application/json;version=2.0',
        'Accept-Language': 'en-US',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchParams)
    })

    console.log('Viator API response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Viator API error response:', errorText)
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Viator API key.')
      }
      
      throw new Error(`Viator API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Received response from Viator. Products count:', data.products?.length || 0)

    if (!data?.products || !Array.isArray(data.products)) {
      console.error('Invalid response structure:', JSON.stringify(data))
      throw new Error('Invalid response structure from Viator API')
    }

    // Transform the data according to v2 API structure
    const experiences = data.products.map((product: any) => ({
      viator_id: product.productCode,
      title: product.title,
      description: product.description || null,
      price: product.pricing?.fromPrice || null,
      image_url: product.primaryPhotoUrl || null,
      destination: product.destination?.name || null
    }))

    console.log(`Transformed ${experiences.length} experiences`)

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials')
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Save experiences to database
    if (experiences.length > 0) {
      console.log('Saving experiences to database')
      const { error } = await supabase
        .from('experiences')
        .upsert(experiences, { 
          onConflict: 'viator_id',
          ignoreDuplicates: false 
        })

      if (error) {
        console.error('Supabase upsert error:', error)
        throw error
      }
      console.log('Successfully saved experiences')
    }

    return new Response(
      JSON.stringify({ 
        experiences,
        message: experiences.length > 0 
          ? `Found ${experiences.length} popular experiences`
          : 'No experiences found. Please try again later.'
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
        message: "Failed to fetch experiences. Please try again later."
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})