import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting to fetch popular experiences')
    
    const VIATOR_API_KEY = Deno.env.get('VIATOR_API_KEY')
    if (!VIATOR_API_KEY) {
      console.error('Missing Viator API key')
      throw new Error('Missing Viator API key')
    }

    console.log('Fetching from Viator API v2...')
    
    // Fetch products from Viator using v2 API with search parameters
    const searchParams = {
      "status": "PUBLISHED",
      "sortOrder": "POPULARITY",
      "count": 20 // Limit to 20 experiences
    }

    const response = await fetch('https://api.viator.com/partner/products/search', {
      method: 'POST',
      headers: {
        'exp-api-key': VIATOR_API_KEY.trim(), // Ensure no whitespace
        'Accept': 'application/json;version=2.0',
        'Accept-Language': 'en-US',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(searchParams)
    })

    console.log('Viator API response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Viator API error response:', errorText)
      console.error('Response headers:', Object.fromEntries(response.headers.entries()))
      
      // Check if it's an auth error and provide more specific error message
      if (response.status === 401) {
        throw new Error('Invalid Viator API key. Please check the API key format and ensure it is correctly set in Supabase secrets.')
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
      title: product.title || 'Untitled Experience',
      description: product.description || null,
      price: product.pricing?.summary?.fromPrice || null,
      image_url: product.images?.[0]?.urls?.['image_preview'] || null,
      destination: product.location?.address?.city || null
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