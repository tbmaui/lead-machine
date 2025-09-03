import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, CheckCircle, XCircle, Clock, Play, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLeadGeneration } from '@/hooks/useLeadGeneration';

const N8N_WEBHOOK_URL = 'https://playground.automateanythingacademy.com/webhook-test/52a2a2ec-2055-4e1c-8ce7-75fe43bbd14c';

interface WebhookTest {
  id: string;
  name: string;
  payload: any;
}

interface WorkflowTest {
  id: string;
  name: string;
  description: string;
  jobCriteria: {
    targetLocation: string;
    selectedIndustries: string[];
    selectedCompanySizes: string[];
    selectedJobTitles: string[];
    leadCount: number[];
  };
}

const webhookTests: WebhookTest[] = [
  {
    id: 'start',
    name: 'Lead Generation Started',
    payload: {
      action: 'lead_generation_started',
      jobId: 'test-job-12345',
      userId: 'test-user-123',
      jobCriteria: {
        targetLocation: 'New York, NY',
        selectedIndustries: ['Technology', 'Healthcare'],
        selectedCompanySizes: ['1-50', '51-200'],
        selectedJobTitles: ['CEO', 'CTO'],
        leadCount: [100]
      },
      message: 'Test lead generation initiated from webhook tester'
    }
  },
  {
    id: 'lead',
    name: 'New Lead Found',
    payload: {
      action: 'new_lead_found',
      jobId: 'test-job-12345',
      leadData: {
        name: 'John Smith',
        title: 'CEO',
        company: 'Tech Innovations Inc',
        linkedinUrl: 'https://linkedin.com/in/johnsmith',
        companyLinkedinUrl: 'https://linkedin.com/company/tech-innovations',
        companyUrl: 'https://techinnovations.com',
        industry: 'Technology',
        location: 'San Francisco, CA'
      },
      message: 'Test lead discovered'
    }
  },
  {
    id: 'complete',
    name: 'Lead Generation Completed',
    payload: {
      action: 'lead_generation_completed',
      jobId: 'test-job-12345',
      totalLeads: 47,
      status: 'completed',
      userId: 'test-user-123',
      message: 'Test lead generation completed successfully'
    }
  },
  {
    id: 'failed',
    name: 'Lead Generation Failed',
    payload: {
      action: 'lead_generation_failed',
      jobId: 'test-job-67890',
      status: 'failed',
      userId: 'test-user-123',
      error: 'API rate limit exceeded',
      message: 'Test lead generation failed'
    }
  }
];

const workflowTests: WorkflowTest[] = [
  {
    id: 'tech-startup',
    name: 'Tech Startup CEOs',
    description: 'Small tech companies in major cities - perfect for testing API integrations',
    jobCriteria: {
      targetLocation: 'Atlanta, GA',
      selectedIndustries: ['Technology'],
      selectedCompanySizes: ['1-50', '51-200'],
      selectedJobTitles: ['CEO', 'CTO', 'Founder'],
      leadCount: [500]
    }
  },
  {
    id: 'healthcare-directors',
    name: 'Healthcare Directors',
    description: 'Mid-size healthcare companies - good for testing enrichment workflows',
    jobCriteria: {
      targetLocation: 'Austin, TX',
      selectedIndustries: ['Healthcare'],
      selectedCompanySizes: ['51-200', '201-500'],
      selectedJobTitles: ['Director', 'VP of Operations', 'CEO'],
      leadCount: [600]
    }
  },
  {
    id: 'construction-owners',
    name: 'Construction Business Owners',
    description: 'Small construction companies nationwide - tests location diversity',
    jobCriteria: {
      targetLocation: 'Los Angeles, CA',
      selectedIndustries: ['Construction'],
      selectedCompanySizes: ['1-50'],
      selectedJobTitles: ['Owner', 'President', 'CEO'],
      leadCount: [550]
    }
  },
  {
    id: 'finance-executives',
    name: 'Financial Services Executives',
    description: 'Large financial firms - high-value targets for workflow testing',
    jobCriteria: {
      targetLocation: 'New York, NY',
      selectedIndustries: ['Financial Services'],
      selectedCompanySizes: ['201-500', '501-1000'],
      selectedJobTitles: ['CFO', 'VP of Finance', 'Director'],
      leadCount: [750]
    }
  },
  {
    id: 'quick-test',
    name: 'Standard Test (500 leads)',
    description: 'Standard workflow test - meets minimum scraper requirements',
    jobCriteria: {
      targetLocation: 'Chicago, IL',
      selectedIndustries: ['Technology', 'Professional Services'],
      selectedCompanySizes: ['1-50'],
      selectedJobTitles: ['CEO', 'Owner'],
      leadCount: [500]
    }
  },
  {
    id: 'comprehensive-test',
    name: 'Comprehensive Test (1000 leads)',
    description: 'Full workflow stress test - multiple industries and sizes',
    jobCriteria: {
      targetLocation: 'San Francisco, CA',
      selectedIndustries: ['Technology', 'Healthcare', 'Manufacturing', 'Professional Services'],
      selectedCompanySizes: ['1-50', '51-200', '201-500'],
      selectedJobTitles: ['CEO', 'CFO', 'Director', 'VP of Operations', 'Owner'],
      leadCount: [1000]
    }
  }
];

export const WebhookTester = () => {
  const { user } = useAuth();
  const { startLeadGeneration, loading } = useLeadGeneration(user?.id || '');
  const [results, setResults] = useState<{[key: string]: 'pending' | 'success' | 'error' | null}>({});
  const [workflowResults, setWorkflowResults] = useState<{[key: string]: 'pending' | 'success' | 'error' | null}>({});
  const [customPayload, setCustomPayload] = useState('{\n  "action": "custom_test",\n  "message": "Custom webhook test",\n  "data": {}\n}');

  const sendWebhook = async (test: WebhookTest) => {
    setResults(prev => ({ ...prev, [test.id]: 'pending' }));
    
    try {
      console.log('🎯 Testing webhook:', test.name, test.payload);
      
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...test.payload,
          timestamp: new Date().toISOString(),
          source: 'webhook-tester',
          environment: 'development'
        })
      });

      if (response.ok) {
        const result = await response.text();
        console.log('✅ Webhook success:', result);
        setResults(prev => ({ ...prev, [test.id]: 'success' }));
      } else {
        console.error('❌ Webhook error:', response.status, response.statusText);
        setResults(prev => ({ ...prev, [test.id]: 'error' }));
      }
    } catch (error) {
      console.error('❌ Webhook network error:', error);
      setResults(prev => ({ ...prev, [test.id]: 'error' }));
    }
  };

  const sendCustomWebhook = async () => {
    setResults(prev => ({ ...prev, 'custom': 'pending' }));
    
    try {
      const payload = JSON.parse(customPayload);
      console.log('🎯 Testing custom webhook:', payload);
      
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          timestamp: new Date().toISOString(),
          source: 'webhook-tester-custom',
          environment: 'development'
        })
      });

      if (response.ok) {
        const result = await response.text();
        console.log('✅ Custom webhook success:', result);
        setResults(prev => ({ ...prev, 'custom': 'success' }));
      } else {
        console.error('❌ Custom webhook error:', response.status, response.statusText);
        setResults(prev => ({ ...prev, 'custom': 'error' }));
      }
    } catch (error) {
      console.error('❌ Custom webhook error:', error);
      setResults(prev => ({ ...prev, 'custom': 'error' }));
    }
  };

  const triggerWorkflow = async (workflowTest: WorkflowTest) => {
    if (!user) {
      console.error('User must be logged in to trigger workflows');
      return;
    }

    setWorkflowResults(prev => ({ ...prev, [workflowTest.id]: 'pending' }));

    try {
      console.log('🚀 Triggering complete workflow:', workflowTest.name, workflowTest.jobCriteria);
      
      await startLeadGeneration(workflowTest.jobCriteria);
      
      setWorkflowResults(prev => ({ ...prev, [workflowTest.id]: 'success' }));
      console.log('✅ Workflow triggered successfully');
    } catch (error) {
      console.error('❌ Workflow trigger error:', error);
      setWorkflowResults(prev => ({ ...prev, [workflowTest.id]: 'error' }));
    }
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error' | null) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: 'pending' | 'success' | 'error' | null) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Sending...</Badge>;
      case 'success':
        return <Badge variant="default">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            N8N Testing Suite
          </CardTitle>
          <CardDescription>
            Test individual webhooks or trigger complete lead generation workflows
          </CardDescription>
          <div className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
            {N8N_WEBHOOK_URL}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="workflows" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="workflows" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Complete Workflows
              </TabsTrigger>
              <TabsTrigger value="webhooks" className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Webhook Tests
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workflows" className="space-y-4 mt-6">
              <div className="text-sm text-muted-foreground mb-4">
                🚀 Trigger complete lead generation workflows with predefined criteria. These will run the full pipeline and send all webhook events.
              </div>
              <div className="grid gap-4">
                {workflowTests.map((workflow) => (
                  <Card key={workflow.id} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            {workflow.name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {workflow.description}
                          </CardDescription>
                          <div className="text-xs text-muted-foreground">
                            📍 {workflow.jobCriteria.targetLocation} • 
                            🏢 {workflow.jobCriteria.selectedIndustries.join(', ')} • 
                            👥 {workflow.jobCriteria.selectedCompanySizes.join(', ')} • 
                            🎯 {workflow.jobCriteria.leadCount[0]} leads
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(workflowResults[workflow.id])}
                          {getStatusBadge(workflowResults[workflow.id])}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button 
                        onClick={() => triggerWorkflow(workflow)}
                        disabled={workflowResults[workflow.id] === 'pending' || loading}
                        size="sm"
                        className="neu-button-primary w-full"
                      >
                        {workflowResults[workflow.id] === 'pending' ? 'Triggering...' : 'Trigger Workflow'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-4 mt-6">
              <div className="text-sm text-muted-foreground mb-4">
                📡 Send individual webhook calls to test specific N8N workflow nodes without running full lead generation.
              </div>
              
              {/* Predefined Tests */}
              <div className="grid gap-4 md:grid-cols-2">
                {webhookTests.map((test) => (
                  <Card key={test.id} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{test.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(results[test.id])}
                          {getStatusBadge(results[test.id])}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button 
                        onClick={() => sendWebhook(test)}
                        disabled={results[test.id] === 'pending'}
                        size="sm"
                        className="w-full"
                      >
                        Send Test
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Custom Payload Test */}
              <Card className="border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Custom Payload Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    value={customPayload}
                    onChange={(e) => setCustomPayload(e.target.value)}
                    placeholder="Enter custom JSON payload..."
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <Button 
                      onClick={sendCustomWebhook}
                      disabled={results['custom'] === 'pending'}
                      size="sm"
                    >
                      Send Custom Test
                    </Button>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(results['custom'])}
                      {getStatusBadge(results['custom'])}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-xs text-muted-foreground">
                💡 Check your browser's console for detailed webhook responses and N8N workflow logs.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};