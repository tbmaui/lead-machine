import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Bug, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabaseConfig } from '@/integrations/supabase/client';
import { getEnvironmentHealthCheck } from '@/lib/env-validation';

/**
 * Debug component to help diagnose Vercel login issues
 * Only shows in development or when explicitly enabled
 */
export function AuthDebugInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const envHealth = getEnvironmentHealthCheck();
  
  const testSupabaseConnection = async () => {
    setTesting(true);
    try {
      // Test basic connectivity to Supabase
      const response = await fetch(`${supabaseConfig.url}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });

      setTestResult({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
    setTesting(false);
  };

  // Always show if there are environment issues, or in development
  // In production, show if there are validation errors or if explicitly enabled
  if (import.meta.env.PROD && envHealth.status === 'healthy' && !window.location.search.includes('debug=true')) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4 border-orange-200">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bug className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg">Debug Info</CardTitle>
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  {import.meta.env.MODE}
                </Badge>
              </div>
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
            <CardDescription>
              Connection diagnostics for troubleshooting login issues
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Environment Health */}
            <div className="space-y-2">
              <h4 className="font-medium flex items-center space-x-2">
                {envHealth.status === 'healthy' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <span>Environment Configuration</span>
              </h4>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Status: <Badge variant={envHealth.status === 'healthy' ? 'default' : 'destructive'}>{envHealth.status}</Badge></div>
                <div>Environment: <Badge variant="outline">{envHealth.environment?.node_env}</Badge></div>
                <div>Supabase URL: <Badge variant={supabaseConfig.url ? 'default' : 'destructive'}>
                  {supabaseConfig.url ? 'Present' : 'Missing'}
                </Badge></div>
                <div>API Key: <Badge variant={supabaseConfig.hasValidKey ? 'default' : 'destructive'}>
                  {supabaseConfig.hasValidKey ? 'Valid' : 'Invalid'}
                </Badge></div>
              </div>

              {envHealth.validation && (envHealth.validation.missing_count > 0 || envHealth.validation.invalid_count > 0) && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {envHealth.validation.missing_count > 0 && (
                      <div>Missing: {envHealth.validation.missing_vars.join(', ')}</div>
                    )}
                    {envHealth.validation.invalid_count > 0 && (
                      <div>Invalid: {envHealth.validation.invalid_vars.join(', ')}</div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Connection Test */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Supabase Connection Test</h4>
                <Button 
                  onClick={testSupabaseConnection} 
                  disabled={testing || !supabaseConfig.hasValidKey}
                  size="sm"
                >
                  {testing ? 'Testing...' : 'Test Connection'}
                </Button>
              </div>

              {testResult && (
                <Alert variant={testResult.success ? 'default' : 'destructive'}>
                  <AlertDescription className="space-y-2">
                    <div className="font-medium">
                      {testResult.success ? '✅ Connection successful' : '❌ Connection failed'}
                    </div>
                    {testResult.error && <div>Error: {testResult.error}</div>}
                    {testResult.status && <div>HTTP Status: {testResult.status} {testResult.statusText}</div>}
                    <div className="text-xs text-muted-foreground">
                      Tested at: {new Date(testResult.timestamp).toLocaleString()}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Configuration Details */}
            <div className="space-y-2">
              <h4 className="font-medium">Configuration Details</h4>
              <div className="bg-muted p-3 rounded-md text-xs font-mono space-y-1">
                <div>URL: {supabaseConfig.url?.replace(/https:\/\/([^.]+)\./, 'https://***.')}</div>
                <div>Key: {supabaseConfig.hasValidKey ? 'eyJ***' + import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(-10) : 'Not set'}</div>
                <div>Origin: {window.location.origin}</div>
                <div>User Agent: {navigator.userAgent.slice(0, 50)}...</div>
              </div>
            </div>

            {/* Troubleshooting Tips */}
            <div className="space-y-2">
              <h4 className="font-medium">Troubleshooting Tips</h4>
              <div className="text-sm space-y-1 text-muted-foreground">
                <div>• Check Vercel environment variables are set correctly</div>
                <div>• Verify Supabase project is active and accessible</div>
                <div>• Ensure CORS is configured for your domain</div>
                <div>• Check browser network tab for specific error details</div>
                <div>• Try accessing Supabase dashboard directly</div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}