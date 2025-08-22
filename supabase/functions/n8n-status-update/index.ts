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
    const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : status;
    console.log('Received status update:', { jobId, status: normalizedStatus, progress, totalLeadsFound, errorMessage, executionId });

    // Validate jobId is present and not empty
    if (!jobId || jobId.trim() === '') {
      console.log('Skipping update - empty or missing jobId');
      return new Response(JSON.stringify({ 
        success: false,
        message: 'jobId is required and cannot be empty'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const updateData: any = {
      status: normalizedStatus,
      updated_at: new Date().toISOString()
    };

    // Default progress mapping when not explicitly provided
    const defaultProgressByStatus: Record<string, number> = {
      processing: 10,
      searching: 40,
      enriching: 60,
      validating: 70,
      finalizing: 90,
      completed: 100,
    };

    // Determine intended progress
    let intendedProgress: number | undefined = undefined;
    if (progress !== undefined) {
      intendedProgress = progress;
    } else if (normalizedStatus && defaultProgressByStatus[normalizedStatus] !== undefined) {
      intendedProgress = defaultProgressByStatus[normalizedStatus];
    }

    // If this looks like the first mid update (e.g., enriching@60) and prior progress <=10,
    // coerce to 20% so the frontend can simulate 30/40/50 without being overwritten.
    if (intendedProgress !== undefined) {
      try {
        const { data: existing, error: readErr } = await supabase
          .from('lead_gen_jobs')
          .select('progress')
          .eq('id', jobId)
          .single();
        if (readErr) {
          console.warn('Read existing job failed (continuing):', readErr.message);
        }
        const prior = existing?.progress ?? 0;
        const isFirstMidUpdate = prior <= 10 && intendedProgress >= 60;
        if (isFirstMidUpdate) {
          intendedProgress = 20;
        }
      } catch (e) {
        console.warn('Error checking prior progress (continuing):', (e as any)?.message);
      }
      updateData.progress = intendedProgress;
    }
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

  } catch (error: any) {
    console.error('Error in n8n-status-update:', error);
    return new Response(JSON.stringify({ 
      error: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});