import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { jobCriteria, userId } = await req.json();
    console.log('Triggering lead generation:', { jobCriteria, userId });

    // Create job record in database
    const { data: job, error: jobError } = await supabase
      .from('lead_gen_jobs')
      .insert({
        user_id: userId,
        job_criteria: jobCriteria,
        status: 'pending'
      })
      .select()
      .single();

    if (jobError) {
      console.error('Error creating job:', jobError);
      throw jobError;
    }

    console.log('Created job:', job);

    // Trigger N8n workflow
    const n8nResponse = await fetch('https://playground.automateanythingacademy.com/webhook/lead-intake', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId: job.id,
        userId: userId,
        criteria: jobCriteria,
        callbackUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/n8n-callback`,
        statusUpdateUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/n8n-status-update`
      }),
    });

    if (!n8nResponse.ok) {
      throw new Error(`N8n webhook failed: ${n8nResponse.status}`);
    }

    const n8nData = await n8nResponse.json();
    console.log('N8n response:', n8nData);

    // Update job with N8n execution ID if provided
    if (n8nData.executionId) {
      await supabase
        .from('lead_gen_jobs')
        .update({
          n8n_execution_id: n8nData.executionId,
          status: 'processing'
        })
        .eq('id', job.id);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      jobId: job.id,
      executionId: n8nData.executionId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in trigger-lead-generation:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});