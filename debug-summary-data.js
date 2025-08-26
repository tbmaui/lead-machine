// Debug script to examine summary data structure in the database
// Run this after lead generation to see what's actually stored

import { createClient } from '@supabase/supabase-js';

// You'll need to add your Supabase URL and anon key here
const supabase = createClient(
  'https://your-project-ref.supabase.co', 
  'your-anon-key'
);

async function debugSummaryData() {
  console.log('🔍 Debugging summary data from recent leads...\n');
  
  // Get the most recent leads
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
    
  if (error) {
    console.error('❌ Error fetching leads:', error);
    return;
  }
  
  if (!leads || leads.length === 0) {
    console.log('❌ No leads found in the database');
    return;
  }
  
  console.log(`📊 Found ${leads.length} recent leads\n`);
  
  leads.forEach((lead, index) => {
    console.log(`\n=== LEAD ${index + 1}: ${lead.name} ===`);
    console.log(`ID: ${lead.id}`);
    console.log(`Created: ${lead.created_at}`);
    
    // Basic info
    console.log(`\n📋 Basic Info:`);
    console.log(`- Name: ${lead.name}`);
    console.log(`- Title: ${lead.title || 'N/A'}`);
    console.log(`- Company: ${lead.company || 'N/A'}`);
    console.log(`- Email: ${lead.email || 'N/A'}`);
    console.log(`- Phone: ${lead.phone || 'N/A'}`);
    console.log(`- Location: ${lead.location || 'N/A'}`);
    console.log(`- Industry: ${lead.industry || 'N/A'}`);
    
    // Additional data analysis
    console.log(`\n🔍 Additional Data Analysis:`);
    const ad = lead.additional_data;
    
    if (!ad) {
      console.log('❌ No additional_data field');
      return;
    }
    
    console.log(`- Type: ${typeof ad}`);
    
    if (typeof ad === 'string') {
      console.log(`- String length: ${ad.length}`);
      console.log(`- String preview: ${ad.substring(0, 200)}...`);
    } else if (typeof ad === 'object' && ad !== null) {
      console.log(`- Object keys (${Object.keys(ad).length}): ${Object.keys(ad).join(', ')}`);
      
      // Look for summary-like fields
      const summaryFields = [
        'summary', 'Summary', 'SUMMARY',
        'description', 'Description', 'DESCRIPTION',
        'bio', 'Bio', 'BIO', 'biography',
        'about', 'About', 'ABOUT', 'about_me',
        'profile', 'Profile', 'PROFILE', 'profile_summary',
        'overview', 'Overview', 'OVERVIEW',
        'headline', 'Headline', 'professional_headline',
        'experience_summary', 'career_summary'
      ];
      
      console.log(`\n📝 Summary Fields Found:`);
      let foundSummary = false;
      
      summaryFields.forEach(field => {
        if (ad[field]) {
          foundSummary = true;
          console.log(`- ${field}: ${typeof ad[field] === 'string' ? ad[field].substring(0, 100) + '...' : JSON.stringify(ad[field]).substring(0, 100) + '...'}`);
        }
      });
      
      if (!foundSummary) {
        console.log('❌ No standard summary fields found');
        
        // Show all string fields that might contain summary data
        console.log(`\n🔍 All String Fields (potential summaries):`);
        Object.entries(ad).forEach(([key, value]) => {
          if (typeof value === 'string' && value.length > 20) {
            console.log(`- ${key}: ${value.substring(0, 80)}...`);
          }
        });
      }
    }
    
    console.log(`\n${'='.repeat(50)}`);
  });
}

// Run the debug function
debugSummaryData().catch(console.error);