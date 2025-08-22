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

    const { jobId, leads, status, executionId } = await req.json();
    console.log('Received N8n callback:', { jobId, leadsCount: leads?.length, status, executionId });

    // Utility to extract phone from various possible key names
    const extractPhone = (lead: any): string | undefined => {
      const candidates = [
        lead['Phone Number'],
        lead['Phone'],
        lead['phone'],
        lead['phoneNumber'],
        lead['Mobile'],
        lead['Mobile Phone'],
        lead['mobile'],
        lead['mobile_phone'],
        lead['Work Phone'],
        lead['work_phone'],
        lead['Direct Dial'],
        lead['direct_dial'],
        lead['directDial'],
      ];
      for (const v of candidates) {
        if (typeof v === 'string' && v.trim().length > 0) return v;
      }
      return undefined;
    };

    // Helpers to extract common fields from various vendor schemas
    const extractCompany = (lead: any): string | undefined => {
      const candidates = [
        lead['Company'], lead['company'], lead['Company Name'], lead['company_name'],
        lead['Organization'], lead['organization'], lead['Organization Name'], lead['organization_name'],
        lead['Employer'], lead['employer'], lead['Employer Name'], lead['employer_name'],
        // nested objects
        lead?.company?.name, lead?.organization?.name, lead?.employer?.name
      ];
      for (const v of candidates) {
        if (typeof v === 'string' && v.trim().length > 0) return v;
      }
      return undefined;
    };

    // Insert leads into database
    if (leads && leads.length > 0) {
      const leadsToInsert = leads.map((lead: any) => ({
        job_id: jobId,
        name: lead.Name || lead.name || '',
        title: lead.Title || lead.title,
        company: extractCompany(lead),
        email: lead.Email || lead.email,
        phone: extractPhone(lead),
        linkedin_url: lead.LinkedInURL || lead.linkedin_url || lead.LinkedIn,
        industry: lead.Industry || lead.industry,
        company_size: lead['Company Size'] || lead.company_size,
        organization_url: lead.OrganizationURL || lead.organization_url || lead.companyWebsite,
        organization_linkedin_url: lead.OrganizationLinkedInURL || lead.organization_linkedin_url || lead.companyLinkedIn,
        score: 0, // Score will be calculated on frontend
        // Preserve full original keys for UI fallbacks
        additional_data: { ...(lead.additional_data || {}), ...lead }
      }));

      const { error: leadsError } = await supabase
        .from('leads')
        .insert(leadsToInsert);

      if (leadsError) {
        console.error('Error inserting leads:', leadsError);
        throw leadsError;
      }

      console.log(`Successfully inserted ${leads.length} leads`);
    }

    // Update job status
    const updateData: any = {
      status: status || 'completed',
      total_leads_found: leads?.length || 0,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (executionId) updateData.n8n_execution_id = executionId;

    const { error: jobError } = await supabase
      .from('lead_gen_jobs')
      .update(updateData)
      .eq('id', jobId);

    if (jobError) {
      console.error('Error updating job:', jobError);
      throw jobError;
    }

    console.log('Successfully completed job processing');

    return new Response(JSON.stringify({ 
      success: true,
      leadsProcessed: leads?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in n8n-callback:', error);
    
    // Try to mark job as failed
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      const { jobId } = await req.json();
      if (jobId) {
        await supabase
          .from('lead_gen_jobs')
          .update({
            status: 'failed',
            error_message: error.message,
            updated_at: new Date().toISOString()
          })
          .eq('id', jobId);
      }
    } catch (updateError) {
      console.error('Error updating job status to failed:', updateError);
    }

    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});