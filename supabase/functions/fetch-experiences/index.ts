import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Map of state names to their major cities and alternate names
const stateMapping: Record<string, string[]> = {
  'Florida': ['Florida', 'FL', 'Miami', 'Orlando', 'Tampa', 'Fort Lauderdale'],
  // Add other states as needed
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
    const destinationResponse = await fetch('https://api.viator.com/partner/v1/taxonomy/destinations?count=1000', {
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
    console.log('Got destinations response')

    if (!destinationData?.data || !Array.isArray(destinationData.data)) {
      console.error('Invalid destination response structure:', destinationData)
      throw new Error('Invalid destination response structure from Viator API')
    }

    const destinations = destinationData.data
    console.log(`Found ${destinations.length} destinations to search through`)

    // Get search terms for the state
    const searchTerms = stateMapping[state] || [state]
    
    // Find destinations that match our state or its major cities
    const matchingDestinations = destinations.filter(dest => {
      if (!dest?.destinationName) return false
      
      const destName = dest.destinationName.toLowerCase()
      const parentName = (dest.parentDestinationName || '').toLowerCase()
      const destLocation = (dest.destinationLocation || '').toLowerCase()
      
      return searchTerms.some(term => 
        destName.includes(term.toLowerCase()) || 
        parentName.includes(term.toLowerCase()) || 
        destLocation.includes(term.toLowerCase())
      )
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

    console.log(`Found ${matchingDestinations.length} matching destinations`)

    // Get experiences for each matching destination
    let allExperiences = []
    const processedDestinations = matchingDestinations.slice(0, 5) // Limit to first 5 destinations to avoid too many requests

    for (const destination of processedDestinations) {
      console.log(`Fetching experiences for destination: ${destination.destinationName}`)
      
      const productsResponse = await fetch(`https://api.viator.com/partner/v1/taxonomy/destinations/${destination.destinationId}/products?count=100`, {
        method: 'GET',
        headers: {
          'exp-api-key': VIATOR_API_KEY,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })

      if (!productsResponse.ok) {
        console.error(`Error fetching products for destination ${destination.destinationName}:`, await productsResponse.text())
        continue // Skip this destination if there's an error
      }

      const productsData = await productsResponse.json()
      
      if (productsData?.data && Array.isArray(productsData.data)) {
        const experiences = productsData.data.map(product => ({
          viator_id: product.productCode || '',
          title: product.productName || 'Untitled Experience',
          description: product.productDescription || '',
          price: product.price?.fromPrice || null,
          image_url: product.thumbnailUrl || product.primaryPhotoUrl || null,
          destination: destination.destinationName
        }))
        
        allExperiences = [...allExperiences, ...experiences]
      }
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseKey) throw new Error('Missing Supabase credentials')
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (allExperiences.length > 0) {
      console.log('Saving experiences to database:', allExperiences.length)
      const { error } = await supabase
        .from('experiences')
        .upsert(allExperiences, { 
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
        experiences: allExperiences,
        message: allExperiences.length > 0 
          ? `Found ${allExperiences.length} experiences in ${state}`
          : `No experiences found in ${state}. Please try a different location.`
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