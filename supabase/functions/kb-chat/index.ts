import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();
    console.log('Received question:', question);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    // Create Supabase client with service role to access KB files
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // List all files in the knowledge-base bucket
    const { data: files, error: listError } = await supabase
      .storage
      .from('knowledge-base')
      .list();

    if (listError) {
      console.error('Error listing KB files:', listError);
      throw listError;
    }

    console.log('Found KB files:', files?.length || 0);

    // Retrieve content from all KB files
    let kbContext = '';
    if (files && files.length > 0) {
      for (const file of files) {
        const { data: fileData, error: downloadError } = await supabase
          .storage
          .from('knowledge-base')
          .download(file.name);

        if (downloadError) {
          console.error(`Error downloading file ${file.name}:`, downloadError);
          continue;
        }

        const text = await fileData.text();
        kbContext += `\n\n=== Content from ${file.name} ===\n${text}\n`;
      }
    }

    console.log('KB context length:', kbContext.length);

    // Call Lovable AI with the KB context
    const systemPrompt = `You are a helpful FAQ assistant for PACE (Platform for Advanced Clinical Excellence). 
Your role is to answer user questions based ONLY on the information provided in the Knowledge Base documents below.

If the answer is not in the Knowledge Base, politely say "I don't have that information in my knowledge base. Please contact support for assistance."

Knowledge Base:
${kbContext || 'No knowledge base documents are currently available.'}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI credits exhausted. Please add credits to continue.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    console.log('Generated answer length:', answer.length);

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in kb-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});