import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Database, Bug, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LeadGenDebuggerProps {
  currentJob: any;
  onJobRefresh: (job: any) => void;
  onLeadsRefresh: (leads: any[]) => void;
}

export function LeadGenDebugger({ currentJob, onJobRefresh, onLeadsRefresh }: LeadGenDebuggerProps) {
  const [checking, setChecking] = useState(false);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const { toast } = useToast();

  const refreshFromDatabase = async () => {
    if (!currentJob?.id) {
      toast({
        title: "No active job",
        description: "No job ID to refresh",
        variant: "destructive"
      });
      return;
    }

    setChecking(true);
    try {
      // Fetch current job status from database
      const { data: jobData, error: jobError } = await supabase
        .from('lead_gen_jobs')
        .select('*')
        .eq('id', currentJob.id)
        .single();

      if (jobError) {
        console.error('Error fetching job from database:', jobError);
        throw jobError;
      }

      console.log('Database job status:', jobData);
      setDbStatus(jobData);

      // If job is completed, fetch leads too
      if (jobData.status === 'completed') {
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select('*')
          .eq('job_id', currentJob.id)
          .order('created_at', { ascending: true });

        if (leadsError) {
          console.error('Error fetching leads:', leadsError);
        } else {
          console.log('Database leads:', leadsData);
          onLeadsRefresh(leadsData || []);
        }
      }

      // Update the frontend state with database values
      onJobRefresh({
        ...jobData,
        status: jobData.status,
        progress: jobData.progress || 0
      });

      toast({
        title: "Status refreshed!",
        description: `Job status: ${jobData.status} (${jobData.progress || 0}%)`,
      });

    } catch (error) {
      console.error('Error refreshing from database:', error);
      toast({
        title: "Refresh failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setChecking(false);
    }
  };

  const restartSubscriptions = () => {
    // Force page refresh to restart subscriptions
    window.location.reload();
  };

  if (!currentJob) {
    return null;
  }

  const isStuck = currentJob.progress <= 10 && Date.now() - new Date(currentJob.created_at).getTime() > 60000; // Stuck for >1 min

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4 border-yellow-200 bg-yellow-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bug className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-lg">Lead Generation Debugger</CardTitle>
            {isStuck && <Badge variant="destructive">Stuck</Badge>}
          </div>
        </div>
        <CardDescription>
          Diagnose and fix real-time subscription issues
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
          <div>
            <div className="text-sm font-medium">Frontend Status</div>
            <div className="flex items-center space-x-2">
              <Badge variant={currentJob.status === 'completed' ? 'default' : currentJob.status === 'failed' ? 'destructive' : 'secondary'}>
                {currentJob.status}
              </Badge>
              <span className="text-sm">{currentJob.progress || 0}%</span>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Job ID</div>
            <div className="text-xs font-mono text-muted-foreground">
              {currentJob.id?.slice(0, 8)}...
            </div>
          </div>
        </div>

        {/* Database Status (if checked) */}
        {dbStatus && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-green-50 rounded-lg">
            <div>
              <div className="text-sm font-medium">Database Status</div>
              <div className="flex items-center space-x-2">
                <Badge variant={dbStatus.status === 'completed' ? 'default' : dbStatus.status === 'failed' ? 'destructive' : 'secondary'}>
                  {dbStatus.status}
                </Badge>
                <span className="text-sm">{dbStatus.progress || 0}%</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Total Leads</div>
              <div className="text-sm">
                {dbStatus.total_leads_found || 0} leads
              </div>
            </div>
          </div>
        )}

        {/* Status Mismatch Warning */}
        {dbStatus && (dbStatus.status !== currentJob.status || dbStatus.progress !== currentJob.progress) && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Status mismatch detected!</strong> The database has different values than what's shown in the UI. 
              This indicates the real-time subscription is broken.
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex flex-col space-y-2">
          <Button 
            onClick={refreshFromDatabase} 
            disabled={checking}
            className="w-full"
            variant="outline"
          >
            {checking ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking Database...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Refresh from Database
              </>
            )}
          </Button>

          <Button 
            onClick={restartSubscriptions}
            variant="secondary"
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Restart Subscriptions (Reload Page)
          </Button>
        </div>

        {/* Troubleshooting Info */}
        <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/30 rounded">
          <div><strong>Common causes:</strong></div>
          <div>• Supabase real-time subscriptions disconnected during pause</div>
          <div>• N8N completed but UI didn't receive the update</div>
          <div>• Edge Functions worked but real-time channel is broken</div>
          <div><strong>Solution:</strong> Use "Refresh from Database" button above</div>
        </div>
      </CardContent>
    </Card>
  );
}