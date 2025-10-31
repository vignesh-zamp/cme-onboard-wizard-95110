import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lei } = await req.json();
    
    if (!lei || lei.length !== 20) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'LEI must be exactly 20 characters' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Fetching LEI data for: ${lei}`);
    
    // Fetch the LEI page
    const response = await fetch(`https://www.legalentityidentifier.in/leicert/${lei}`);
    const html = await response.text();
    
    // Parse the HTML to extract company data
    const legalNameMatch = html.match(/Legal name<\/td>\s*<td[^>]*>([^<]+)<\/td>/i);
    const addressMatch = html.match(/Legal address<\/td>\s*<td[^>]*>([^<]+)<\/td>/i);
    const registrationIdMatch = html.match(/Registration authority entity ID<\/td>\s*<td[^>]*>([^<]+)<\/td>/i);
    const entityStatusMatch = html.match(/Entity status<\/td>\s*<td[^>]*>([^<]+)<\/td>/i);
    const leiStatusMatch = html.match(/Status<\/td>\s*<td[^>]*>([^<]+)<\/td>/i);
    const renewalMatch = html.match(/Automatic renewal until<\/td>\s*<td[^>]*>([^<]+)<\/td>/i);
    const managingLouMatch = html.match(/Managing LOU<\/td>\s*<td[^>]*>([^<]+)<\/td>/i);
    
    if (!legalNameMatch) {
      console.log('LEI not found in registry');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'LEI not found in the registry. Please verify the LEI code.' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const companyData = {
      success: true,
      data: {
        legalName: legalNameMatch[1].trim(),
        address: addressMatch ? addressMatch[1].trim() : 'N/A',
        registrationId: registrationIdMatch ? registrationIdMatch[1].trim() : 'N/A',
        entityStatus: entityStatusMatch ? entityStatusMatch[1].trim() : 'N/A',
        leiCode: lei,
        leiStatus: leiStatusMatch ? leiStatusMatch[1].trim() : 'N/A',
        renewalDate: renewalMatch ? renewalMatch[1].trim() : 'N/A',
        managingLou: managingLouMatch ? managingLouMatch[1].trim() : 'N/A'
      }
    };

    console.log('Successfully parsed LEI data:', companyData);

    return new Response(
      JSON.stringify(companyData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error verifying LEI:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to verify LEI. Please try again.' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
