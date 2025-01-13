import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting Viator API request')
    
    const VIATOR_API_KEY = Deno.env.get('VIATOR_API_KEY')
    if (!VIATOR_API_KEY) {
      throw new Error('Missing Viator API key')
    }

    const endpoint = 'https://api.viator.com/partner/products/search'
    console.log(`Endpoint: ${endpoint}`)
    
    // Current date and one month from now
    const today = new Date()
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    // Search parameters matching Postman configuration
    const searchBody = {
      filtering: {
        destination: "732",
        tags: [21972],
        flags: ["LIKELY_TO_SELL_OUT", "FREE_CANCELLATION"],
        lowestPrice: 5,
        highestPrice: 500,
        startDate: today.toISOString().split('T')[0],
        endDate: nextMonth.toISOString().split('T')[0],
        includeAutomaticTranslations: true,
        confirmationType: "INSTANT",
        durationInMinutes: {
          from: 20,
          to: 360
        },
        rating: {
          from: 3,
          to: 5
        }
      },
      sorting: {
        sort: "TRAVELER_RATING",
        order: "DESCENDING"
      },
      pagination: {
        start: 1,
        count: 5
      },
      currency: "USD"
    }

    console.log('Request headers:', {
      'Accept-Language': 'en-US',
      'Accept': 'application/json;version=2.0',
      'Content-Type': 'application/json',
      'exp-api-key': '[MASKED]'
    })
    console.log('Request body:', JSON.stringify(searchBody, null, 2))

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept-Language': 'en-US',
        'Accept': 'application/json;version=2.0',
        'Content-Type': 'application/json',
        'exp-api-key': VIATOR_API_KEY
      },
      body: JSON.stringify(searchBody)
    })

    console.log(`Response status: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      
      try {
        const errorJson = JSON.parse(errorText)
        throw new Error(`API error (${response.status}): ${JSON.stringify(errorJson)}`)
      } catch (parseError) {
        throw new Error(`API error (${response.status}): ${errorText}`)
      }
    }

    const data = await response.json()
    console.log('Successfully retrieved products:', data.data?.length || 0)

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully retrieved ${data.data?.length || 0} experiences`,
        data: data
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