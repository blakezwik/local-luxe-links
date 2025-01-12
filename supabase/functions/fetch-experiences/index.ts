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

interface ViatorDestination {
  data: {
    destinationId: string;
    destinationName: string;
    parentId?: string;
    parentName?: string;
    location?: {
      coordinates?: {
        latitude: number;
        longitude: number;
      }
    }
  }[];
}

interface ViatorProduct {
  data: {
    productCode: string;
    title: string;
    description?: string;
    price: {
      fromPrice: number;
    };
    pictures?: {
      urls: string[];
    }[];
    location?: {
      address?: {
        city?: string;
        state?: string;
      }
    }
  }[];
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

    // Get today's date and tomorrow's date in YYYY-MM-DD format
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const startDate = today.toISOString().split('T')[0]
    const endDate = tomorrow.toISOString().split('T')[0]

    console.log(`Searching for experiences between ${startDate} and ${endDate}`)

    // First, get destination ID for the state
    console.log('Searching for destination:', state)
    const destinationResponse = await fetch('https://api.viator.com/partner/v2/destination/search', {
      method: 'POST',
      headers: {
        'exp-api-key': VIATOR_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: state,
        count: 100
      })
    })

    if (!destinationResponse.ok) {
      console.error('Viator API destination error:', await destinationResponse.text())
      throw new Error('Failed to fetch destinations from Viator API')
    }

    const destinationData: ViatorDestination = await destinationResponse.json()
    console.log('Got destinations response:', JSON.stringify(destinationData))

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
      const parentName = (dest.parentName || '').toLowerCase()
      
      return searchTerms.some(term => 
        destName.includes(term.toLowerCase()) || 
        parentName.includes(term.toLowerCase())
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

    console.log(`Found ${matchingDestinations.length} matching destinations:`, matchingDestinations)

    // Get experiences for each matching destination
    let allExperiences = []
    const processedDestinations = matchingDestinations.slice(0, 5) // Limit to first 5 destinations

    for (const destination of processedDestinations) {
      console.log(`Fetching experiences for destination: ${destination.destinationName} (ID: ${destination.destinationId})`)
      
      try {
        const productsResponse = await fetch('https://api.viator.com/partner/v2/products', {
          method: 'POST',
          headers: {
            'exp-api-key': VIATOR_API_KEY,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate: startDate,
            endDate: endDate,
            count: 100,
            destinationId: destination.destinationId
          })
        })

        if (!productsResponse.ok) {
          console.error(`Error fetching products for destination ${destination.destinationName}:`, await productsResponse.text())
          continue // Skip this destination if there's an error
        }

        const productsData: ViatorProduct = await productsResponse.json()
        console.log(`Got products response for ${destination.destinationName}:`, JSON.stringify(productsData))
        
        if (!productsData?.data || !Array.isArray(productsData.data)) {
          console.error(`Invalid products response for destination ${destination.destinationName}:`, productsData)
          continue
        }

        const experiences = productsData.data.map(product => ({
          viator_id: product.productCode,
          title: product.title || 'Untitled Experience',
          description: product.description || '',
          price: product.price?.fromPrice || null,
          image_url: product.pictures?.[0]?.urls?.[0] || null,
          destination: destination.destinationName
        }))
        
        allExperiences = [...allExperiences, ...experiences]
        console.log(`Added ${experiences.length} experiences from ${destination.destinationName}`)
      } catch (error) {
        console.error(`Error processing destination ${destination.destinationName}:`, error)
        continue // Skip this destination if there's an error
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