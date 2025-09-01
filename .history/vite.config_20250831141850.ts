import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Validate environment variables during build
function validateEnvironmentVariables(mode: string, env: Record<string, string>) {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const missing: string[] = [];
  const invalid: string[] = [];

  for (const varName of requiredVars) {
    const value = env[varName];
    
    if (!value || value.trim() === '') {
      missing.push(varName);
      continue;
    }

    // Validate format
    if (varName === 'VITE_SUPABASE_URL') {
      if (!value.startsWith('https://') || !value.includes('.supabase.co')) {
        invalid.push(`${varName}: Must be a valid Supabase URL`);
      }
    } else if (varName === 'VITE_SUPABASE_ANON_KEY') {
      if (!value.startsWith('eyJ') || value.length < 100) {
        invalid.push(`${varName}: Must be a valid Supabase JWT token`);
      }
    }
  }

  if (missing.length > 0 || invalid.length > 0) {
    console.error('\n❌ Environment Configuration Error');
    console.error('=====================================');
    
    if (missing.length > 0) {
      console.error('\nMissing Required Variables:');
      missing.forEach(varName => console.error(`  • ${varName}`));
    }
    
    if (invalid.length > 0) {
      console.error('\nInvalid Variable Values:');
      invalid.forEach(error => console.error(`  • ${error}`));
    }
    
    console.error('\n🔧 How to Fix:');
    console.error('1. Copy .env.example to .env.local');
    console.error('2. Fill in your actual Supabase credentials');
    console.error('3. Restart the build process');
    console.error('\n📚 For more help, see: .env.example\n');
    
    process.exit(1);
  }

  console.log(`✅ Environment validation passed for ${mode} mode`);
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables using Vite's built-in mechanism
  const env = loadEnv(mode, process.cwd(), '');
  
  // Validate environment variables before proceeding
  validateEnvironmentVariables(mode, env);

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      include: ['xlsx'],
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['src/test/setup.ts'],
      globals: true,
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        reportsDirectory: 'coverage',
        include: ['src/components/LeadsTable.tsx'],
      },
    },
  };
});
