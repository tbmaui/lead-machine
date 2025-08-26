import { chromium } from 'playwright';

async function debugIndustryData() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Enable console logging
  page.on('console', (msg) => {
    console.log(`[BROWSER LOG] ${msg.type()}: ${msg.text()}`);
  });

  // Enable error logging
  page.on('pageerror', (error) => {
    console.log(`[BROWSER ERROR] ${error.message}`);
  });

  try {
    console.log('Navigating to the application...');
    await page.goto('http://localhost:8080');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Look for existing leads table or wait for it
    console.log('Checking for leads table...');
    
    // Check if there's already data in the table
    const existingRows = await page.locator('table tbody tr').count();
    console.log(`Found ${existingRows} existing lead rows`);

    if (existingRows > 0) {
      console.log('Examining existing lead data...');
      
      // Extract lead data from the table to understand the structure
      const leadData = await page.evaluate(() => {
        const rows = document.querySelectorAll('table tbody tr');
        const leads = [];
        
        rows.forEach((row, index) => {
          const cells = row.querySelectorAll('td');
          if (cells.length > 0) {
            const leadInfo = {
              index,
              name: cells[0]?.textContent?.trim(),
              title: cells[1]?.textContent?.trim(),
              company: cells[2]?.textContent?.trim(),
              industry: cells[3]?.textContent?.trim(),
              summary: cells[cells.length - 1]?.textContent?.trim()
            };
            leads.push(leadInfo);
          }
        });
        
        return leads;
      });

      console.log('Lead data from table:');
      leadData.forEach((lead, i) => {
        console.log(`Lead ${i + 1}:`);
        console.log(`  Name: ${lead.name}`);
        console.log(`  Title: ${lead.title}`);
        console.log(`  Company: ${lead.company}`);
        console.log(`  Industry: ${lead.industry}`);
        console.log(`  Summary: ${lead.summary?.substring(0, 100)}...`);
        console.log('---');
      });

      // Now inspect the browser's console for debug logs about LinkedIn data
      console.log('Checking browser console for LinkedIn debug data...');
      
      // Force a re-render or refresh to see the debug logs
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Wait a bit for any async console logs to appear
      await page.waitForTimeout(3000);
    } else {
      console.log('No existing leads found. You may need to run a lead generation job first.');
    }

    // Keep the browser open for manual inspection
    console.log('Browser will stay open for manual inspection. Close it when done.');
    
    // Don't close automatically - let user inspect
    await new Promise(() => {}); // Infinite wait

  } catch (error) {
    console.error('Error during debugging:', error);
  } finally {
    // await browser.close();
  }
}

debugIndustryData();