# 🚀 Production Deployment Guide

This guide provides comprehensive instructions for securely deploying the Lead Machine application to production environments.

## 🔐 Security Requirements

### **CRITICAL SECURITY NOTICE**
This application uses **secure environment variable configuration** and **will NOT start** without proper environment setup. This is intentional security behavior to prevent accidental credential exposure.

## 📋 Pre-Deployment Checklist

### ✅ Environment Configuration
- [ ] Production environment variables configured in hosting platform
- [ ] NO `.env` files deployed to production servers
- [ ] Environment variable validation passes (`npm run env:check`)
- [ ] Build process completes successfully with production config

### ✅ Security Validation
- [ ] No hardcoded credentials in source code
- [ ] All secrets stored in secure secrets management
- [ ] HTTPS enforced for all production traffic
- [ ] Environment health check endpoint responds correctly

### ✅ Application Testing
- [ ] All tests pass (`npm run test`)
- [ ] Build completes without errors (`npm run build:prod`)
- [ ] Application starts correctly in production mode
- [ ] Database connectivity confirmed

## 🌍 Environment Variables Setup

### Required Variables

The following environment variables are **REQUIRED** and must be configured in your production hosting platform:

```bash
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anonymous_key_here

# Feature Flags (Optional)
VITE_FEATURE_HERO_V2=false
```

### How to Obtain Supabase Credentials

1. **Login to Supabase Dashboard**: https://app.supabase.com
2. **Navigate to Your Project**: Select your Lead Machine project
3. **Go to Settings > API**: https://app.supabase.com/project/YOUR_PROJECT/settings/api
4. **Copy the Required Values**:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### Environment Variable Validation

The application includes built-in validation that will:
- ✅ Verify all required variables are present
- ✅ Validate Supabase URL format (must be https://*.supabase.co)
- ✅ Validate anonymous key format (must be valid JWT token)
- ❌ **Fail fast** if any validation checks fail

## 🏗️ Platform-Specific Deployment

### Vercel Deployment

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Configure Environment Variables**:
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   vercel env add VITE_FEATURE_HERO_V2
   ```

3. **Deploy**:
   ```bash
   npm run build:prod  # Validate environment first
   vercel deploy --prod
   ```

### Netlify Deployment

1. **Configure Environment Variables** in Netlify Dashboard:
   - Go to Site Settings > Environment Variables
   - Add each required variable

2. **Build Configuration** in `netlify.toml`:
   ```toml
   [build]
   command = "npm run build:prod"
   publish = "dist"
   
   [build.environment]
   NODE_VERSION = "18"
   ```

3. **Deploy**:
   - Push to your connected Git repository
   - Netlify will automatically build and deploy

### Docker Deployment

1. **Create Production Dockerfile**:
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   
   # Environment variables will be injected at runtime
   RUN npm run build:prod
   
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Environment Variables** (pass via docker run or docker-compose):
   ```bash
   docker run -d \
     -e VITE_SUPABASE_URL=https://your-project.supabase.co \
     -e VITE_SUPABASE_ANON_KEY=your_key_here \
     -e VITE_FEATURE_HERO_V2=false \
     -p 80:80 \
     your-app:latest
   ```

### Traditional VPS/Server Deployment

1. **Install Dependencies**:
   ```bash
   npm ci --only=production
   ```

2. **Create Production Environment File** (server-side only):
   ```bash
   # Create secure environment file (never commit to git)
   sudo nano /etc/leadmachine/production.env
   ```

3. **Build and Deploy**:
   ```bash
   # Load environment variables
   export $(cat /etc/leadmachine/production.env | xargs)
   
   # Validate and build
   npm run env:check
   npm run build:prod
   
   # Deploy built files to web server
   sudo cp -r dist/* /var/www/html/
   ```

## 🔍 Health Checks & Monitoring

### Environment Health Check Endpoint

The application includes a built-in health check endpoint for monitoring:

```typescript
// Usage in monitoring systems
fetch('/api/health')
  .then(response => response.json())
  .then(health => {
    console.log('App Status:', health.status); // 'healthy' | 'unhealthy' | 'error'
    console.log('Environment:', health.environment);
    console.log('Supabase:', health.supabase);
  });
```

### Production Monitoring Setup

1. **Basic Health Check**:
   ```bash
   # Quick status check
   curl https://your-app.com/api/health/status
   ```

2. **Detailed Health Information**:
   ```bash
   # Full health report
   curl https://your-app.com/api/health | jq '.'
   ```

3. **Monitoring Alerts** (configure in your monitoring system):
   - Alert when `status !== 'healthy'`
   - Alert when `checks.environment_validation === 'fail'`
   - Alert when `checks.supabase_config === 'fail'`

## 🚨 Troubleshooting

### Common Issues and Solutions

#### ❌ "Missing required environment variables" Error

**Problem**: Application fails to start with environment configuration error.

**Solution**:
1. Verify all required variables are configured in your hosting platform
2. Check variable names exactly match (case-sensitive):
   - `VITE_SUPABASE_URL` (not `SUPABASE_URL`)
   - `VITE_SUPABASE_ANON_KEY` (not `SUPABASE_KEY`)
3. Ensure values don't contain extra quotes or whitespace
4. Run `npm run env:check` locally to test

#### ❌ "Invalid Supabase URL" Error

**Problem**: URL format validation fails.

**Solution**:
1. Ensure URL starts with `https://`
2. Ensure URL ends with `.supabase.co`
3. Example: `https://abcdefghijk.supabase.co`

#### ❌ "Invalid Supabase JWT token" Error

**Problem**: Anonymous key validation fails.

**Solution**:
1. Ensure you're using the **anon/public** key (not service_role key)
2. Key should start with `eyJ`
3. Key should be 100+ characters long
4. Copy directly from Supabase dashboard without modifications

#### ❌ Build Fails in Production

**Problem**: `npm run build:prod` fails with environment errors.

**Solution**:
1. Ensure all environment variables are available during build
2. Check build logs for specific missing variables
3. Verify hosting platform injects environment variables during build time
4. Some platforms require build-time environment variable configuration

#### ❌ Application Loads but Supabase Connection Fails

**Problem**: App starts but database operations fail.

**Solution**:
1. Check browser developer console for network errors
2. Verify Supabase project is active and accessible
3. Confirm anonymous key has correct permissions
4. Check CORS configuration in Supabase dashboard
5. Use health check endpoint to diagnose: `/api/health`

### Debug Mode

For debugging production issues, temporarily enable debug logging:

```bash
# Add to environment variables temporarily
VITE_DEBUG_ENV=true
```

This will log detailed environment configuration (without exposing secrets).

## 🔄 Deployment Workflow

### Recommended CI/CD Pipeline

1. **Pre-deployment Validation**:
   ```yaml
   # Example GitHub Actions workflow
   - name: Validate Environment Configuration
     run: npm run env:check
   
   - name: Run Tests
     run: npm run test
   
   - name: Build Production
     run: npm run build:prod
   ```

2. **Security Scanning**:
   ```yaml
   - name: Security Audit
     run: npm audit --audit-level high
   
   - name: Check for Exposed Secrets
     run: git log --all --full-history -- .env
   ```

3. **Deployment**:
   ```yaml
   - name: Deploy to Production
     run: |
       # Deploy built assets
       # Configure environment variables
       # Run health checks
   ```

## 🔒 Security Best Practices

### Do's ✅
- ✅ Store all secrets in your hosting platform's secure environment variable system
- ✅ Use HTTPS for all production traffic
- ✅ Regularly rotate Supabase keys
- ✅ Monitor health check endpoints
- ✅ Keep dependencies updated
- ✅ Use the built-in environment validation

### Don'ts ❌
- ❌ NEVER commit `.env` files to version control
- ❌ NEVER hardcode credentials in source code
- ❌ NEVER use development keys in production
- ❌ NEVER expose service_role keys in client-side code
- ❌ NEVER disable environment validation
- ❌ NEVER deploy without testing environment configuration

## 📞 Support

### Getting Help

1. **Environment Issues**: Check this deployment guide first
2. **Build Errors**: Review the troubleshooting section
3. **Supabase Issues**: Consult [Supabase documentation](https://supabase.com/docs)
4. **Application Issues**: Check application logs and health check endpoint

### Health Check Information

Use the health check endpoint to diagnose issues:

```bash
curl https://your-app.com/api/health | jq '{status, checks, validation}'
```

This provides detailed information about:
- Environment variable configuration
- Supabase connection status
- Build requirements validation
- Application health status

---

## ✅ Deployment Verification

After deployment, verify everything is working:

1. **Application Loads**: Visit your production URL
2. **Health Check**: Visit `/api/health` endpoint
3. **Environment Status**: All checks should show "pass"
4. **Functionality**: Test lead generation features
5. **Monitoring**: Configure alerts for health check failures

**🎉 Your Lead Machine application is now securely deployed to production!**