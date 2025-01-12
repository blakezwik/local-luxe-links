import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { state } = await req.json()
    console.log('Fetching experiences for state:', state)
    
    const VIATOR_API_KEY = Deno.env.get('VIATOR_API_KEY')
    if (!VIATOR_API_KEY) {
      throw new Error('Missing Viator API key')
    }

    // First, get destination ID for the state using the correct endpoint format
    console.log('Searching for destination:', state)
    const destinationResponse = await fetch('https://api.viator.com/partner/v1/taxonomy/destinations', {
      method: 'GET',
      headers: {
        'exp-api-key': VIATOR_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })

    if (!destinationResponse.ok) {
      const errorText = await destinationResponse.text()
      console.error('Viator API destination error:', errorText)
      throw new Error(`Viator API destination error: ${errorText}`)
    }

    const destinationData = await destinationResponse.json()
    console.log('Destination search response:', JSON.stringify(destinationData, null, 2))

    // Find the destination that matches our state
    const destination = destinationData.data.find((dest: any) => 
      dest.destinationName.toLowerCase().includes(state.toLowerCase()) ||
      dest.parentDestinationName?.toLowerCase().includes(state.toLowerCase())
    )

    if (!destination) {
      return new Response(
        JSON.stringify({ 
          experiences: [],
          message: `No destinations found for ${state}` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    const destinationId = destination.destinationId
    console.log('Found destination ID:', destinationId)

    // Then, get top experiences for this destination using the correct endpoint
    const response = await fetch(`https://api.viator.com/partner/v1/taxonomy/destinations/${destinationId}/products`, {
      method: 'GET',
      headers: {
        'exp-api-key': VIATOR_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Viator API error:', errorText)
      throw new Error(`Viator API error: ${errorText}`)
    }

    const data = await response.json()
    console.log('Products response:', JSON.stringify(data, null, 2))

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseKey) throw new Error('Missing Supabase credentials')
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Map the products to our experience format
    const experiences = data.data?.slice(0, 10).map((product: any) => ({
      viator_id: product.productCode || product.productId,
      title: product.productName || product.title,
      description: product.productDescription || product.description,
      price: product.price?.fromPrice,
      image_url: product.thumbnailUrl || product.primaryPhotoUrl,
      destination: state
    })) || []

    if (experiences.length > 0) {
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
          ? `Found ${experiences.length} top experiences in ${state}`
          : `No experiences found in ${state}`
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