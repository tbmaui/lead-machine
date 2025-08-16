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

    const { jobId, status, progress, totalLeadsFound, errorMessage, executionId } = await req.json();
    console.log('Received status update:', { jobId, status, progress, totalLeadsFound, errorMessage, executionId });

    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (progress !== undefined) updateData.progress = progress;
    if (totalLeadsFound !== undefined) updateData.total_leads_found = totalLeadsFound;
    if (errorMessage) updateData.error_message = errorMessage;
    if (executionId) updateData.n8n_execution_id = executionId;
    if (status === 'completed') updateData.completed_at = new Date().toISOString();

    const { error } = await supabase
      .from('lead_gen_jobs')
      .update(updateData)
      .eq('id', jobId);

    if (error) {
      console.error('Error updating job status:', error);
      throw error;
    }

    console.log('Successfully updated job status');

    return new Response(JSON.stringify({ 
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in n8n-status-update:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});