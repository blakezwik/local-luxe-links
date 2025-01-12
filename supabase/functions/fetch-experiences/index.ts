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
      throw new Error('Missing Viator API key')
    }

    // Fetch popular products from Viator
    console.log('Fetching from Viator API...')
    const response = await fetch('https://api.viator.com/partner/products/popular', {
      method: 'GET',
      headers: {
        'exp-api-key': VIATOR_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      console.error('Viator API error:', await response.text())
      throw new Error(`Viator API returned ${response.status}`)
    }

    const data = await response.json()
    console.log('Received response from Viator:', JSON.stringify(data))

    if (!data?.data || !Array.isArray(data.data)) {
      console.error('Invalid response structure:', data)
      throw new Error('Invalid response structure from Viator API')
    }

    // Transform the data
    const experiences = data.data.map((product: any) => ({
      viator_id: product.productCode,
      title: product.title || 'Untitled Experience',
      description: product.description || null,
      price: product.price?.fromPrice || null,
      image_url: product.pictures?.[0]?.urls?.[0] || null,
      destination: product.destination || null
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