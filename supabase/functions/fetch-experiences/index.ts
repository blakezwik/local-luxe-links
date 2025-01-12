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

    // Search for experiences based on state only
    const response = await fetch('https://api.viator.com/partner/products/search', {
      method: 'POST',
      headers: {
        'exp-api-key': VIATOR_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "sortOrder": "RECOMMENDED",
        "page": {
          "size": 20,
          "number": 0
        },
        "destination": {
          "text": state
        }
      })
    })

    if (!response.ok) {
      console.error('Viator API error:', await response.text())
      throw new Error(`Viator API returned ${response.status}`)
    }

    const data = await response.json()
    console.log('Viator API response:', JSON.stringify(data, null, 2))

    if (!data.products || !Array.isArray(data.products)) {
      console.error('Unexpected response format:', data)
      throw new Error('Invalid response format from Viator API')
    }

    console.log(`Found ${data.products.length} experiences for state: ${state}`)

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseKey) throw new Error('Missing Supabase credentials')
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Store experiences in the database
    const experiences = data.products.map((product: any) => ({
      viator_id: product.productCode,
      title: product.title,
      description: product.description,
      price: product.price?.fromPrice,
      image_url: product.productUrlId,
      destination: state
    }))

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
      JSON.stringify({ experiences }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})