# Vercel Deployment Troubleshooting Guide

## "Failed to fetch" Login Error

The "failed to fetch" error during login is typically caused by one of these issues:

### 1. Missing Environment Variables
**Symptoms:** Login fails immediately with "failed to fetch"
**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the required variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

**How to find these values:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon/public key

### 2. Incorrect Environment Variable Values
**Symptoms:** Debug info shows "Invalid" for URL or API key
**Solution:**
- Verify SUPABASE_URL format: `https://yourproject.supabase.co`
- Verify ANON_KEY is a JWT token starting with `eyJ`
- No trailing spaces or quotes in Vercel environment variables

### 3. CORS Configuration
**Symptoms:** Browser console shows CORS errors
**Solution:**
1. Go to Supabase Dashboard → Authentication → Settings
2. Add your Vercel domain to "Site URL" 
3. Add your domain to "Additional Redirect URLs" if using OAuth

### 4. Supabase RLS Policies
**Symptoms:** Auth works but data queries fail
**Solution:**
- Check that Row Level Security policies allow authenticated users
- Verify your tables have appropriate policies enabled

### 5. Network/Firewall Issues
**Symptoms:** Intermittent failures or timeouts
**Solution:**
- Check if corporate firewall blocks Supabase domains
- Test from different networks/devices
- Check Supabase status page for service issues

## Debug Steps

1. **Use the Debug Component:**
   - Visit your login page on Vercel
   - Look for the "Debug Info" section below the login form
   - Click to expand and run the connection test

2. **Check Browser Network Tab:**
   - Open Developer Tools → Network tab
   - Try to login and see which requests fail
   - Look for 4xx/5xx status codes or network errors

3. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Your Project → Functions tab
   - Look for error logs during failed requests

4. **Test Environment Variables:**
   ```bash
   # In your local environment, test the same values:
   VITE_SUPABASE_URL=https://yourproject.supabase.co \
   VITE_SUPABASE_ANON_KEY=your_key_here \
   npm run build
   ```

## Common Solutions

### Redeploy After Environment Changes
After adding/changing environment variables in Vercel:
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy" to pick up new environment variables

### Clear Browser Cache
Sometimes cached files interfere:
1. Open Developer Tools
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Verify Supabase Project Status
1. Go to Supabase Dashboard
2. Check if project is paused (happens on free tier after inactivity)
3. Un-pause if necessary

## Contact Support

If none of the above solutions work:
1. Share the debug output from the login page
2. Share any browser console errors
3. Include the Vercel deployment URL
4. Include your Supabase project reference (NOT the keys!)

## Production Checklist

Before deploying to production:
- [ ] Environment variables set in Vercel
- [ ] Supabase CORS configured for your domain
- [ ] RLS policies configured and tested
- [ ] Custom domain (if using one) added to Supabase settings
- [ ] Build passes locally with production environment variables