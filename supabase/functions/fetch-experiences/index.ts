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

    // First, get destination ID for the state
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
    console.log('Destination API response:', JSON.stringify(destinationData, null, 2))

    // Validate response structure
    if (!destinationData?.data || !Array.isArray(destinationData.data)) {
      console.error('Invalid destination response:', destinationData)
      throw new Error('Invalid destination response from Viator API')
    }

    const destinations = destinationData.data
    console.log(`Found ${destinations.length} destinations to search through`)

    // Find destinations that match our state
    const searchState = state.toLowerCase()
    const matchingDestinations = destinations.filter(dest => {
      if (!dest?.destinationName) return false;
      
      const destName = dest.destinationName.toLowerCase()
      const parentName = (dest.parentDestinationName || '').toLowerCase()
      const destLocation = (dest.destinationLocation || '').toLowerCase()
      
      // Log each destination we're checking
      console.log('Checking destination:', {
        name: destName,
        parent: parentName,
        location: destLocation,
        searchingFor: searchState
      })
      
      return destName.includes(searchState) || 
             parentName.includes(searchState) || 
             destLocation.includes(searchState)
    })

    if (matchingDestinations.length === 0) {
      console.log('No matching destinations found for state:', state)
      return new Response(
        JSON.stringify({ 
          experiences: [],
          message: `No destinations found for ${state}. Please try a different location.` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    console.log('Found matching destinations:', matchingDestinations)

    // Get experiences for the first matching destination
    const destination = matchingDestinations[0]
    const destinationId = destination.destinationId
    console.log('Fetching experiences for destination ID:', destinationId)

    const productsResponse = await fetch(`https://api.viator.com/partner/v1/taxonomy/destinations/${destinationId}/products`, {
      method: 'GET',
      headers: {
        'exp-api-key': VIATOR_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })

    if (!productsResponse.ok) {
      const errorText = await productsResponse.text()
      console.error('Viator API products error:', errorText)
      throw new Error(`Viator API products error: ${errorText}`)
    }

    const productsData = await productsResponse.json()
    console.log('Products API response:', JSON.stringify(productsData, null, 2))

    if (!productsData?.data || !Array.isArray(productsData.data)) {
      console.error('Invalid products response:', productsData)
      throw new Error('Invalid products response from Viator API')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseKey) throw new Error('Missing Supabase credentials')
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Map products to experiences format
    const experiences = productsData.data.map(product => ({
      viator_id: product.productCode || '',
      title: product.productName || 'Untitled Experience',
      description: product.productDescription || '',
      price: product.price?.fromPrice || null,
      image_url: product.thumbnailUrl || product.primaryPhotoUrl || null,
      destination: state
    }))

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
          ? `Found ${experiences.length} experiences in ${destination.destinationName}`
          : `No experiences found in ${destination.destinationName}. Please try a different location.`
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