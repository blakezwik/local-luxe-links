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
    console.log('Fetching popular experiences')
    
    const VIATOR_API_KEY = Deno.env.get('VIATOR_API_KEY')
    if (!VIATOR_API_KEY) {
      throw new Error('Missing Viator API key')
    }

    // Get today's date and tomorrow's date in YYYY-MM-DD format
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const startDate = today.toISOString().split('T')[0]
    const endDate = tomorrow.toISOString().split('T')[0]

    console.log(`Searching for experiences between ${startDate} and ${endDate}`)

    // Fetch popular products directly
    const productsResponse = await fetch('https://api.viator.com/partner/products/popular', {
      method: 'GET',
      headers: {
        'exp-api-key': VIATOR_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })

    if (!productsResponse.ok) {
      console.error('Viator API error:', await productsResponse.text())
      throw new Error('Failed to fetch experiences from Viator API')
    }

    const productsData = await productsResponse.json()
    console.log('Got products response:', JSON.stringify(productsData))

    if (!productsData?.data) {
      console.error('Invalid products response:', productsData)
      throw new Error('Invalid response structure from Viator API')
    }

    const experiences = productsData.data.map((product: any) => ({
      viator_id: product.productCode || product.code,
      title: product.title || 'Untitled Experience',
      description: product.description || '',
      price: product.price?.fromPrice || null,
      image_url: product.pictures?.[0]?.urls?.[0] || null,
      destination: product.destination || 'Popular Experience'
    }))

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseKey) throw new Error('Missing Supabase credentials')
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (experiences.length > 0) {
      console.log('Saving experiences to database:', experiences.length)
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
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || "Unknown error occurred",
        message: "Failed to fetch experiences. Please try again later."
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})