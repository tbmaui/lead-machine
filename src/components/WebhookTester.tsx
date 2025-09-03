import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Send, CheckCircle, XCircle, Clock } from 'lucide-react';

const N8N_WEBHOOK_URL = 'https://playground.automateanythingacademy.com/webhook-test/52a2a2ec-2055-4e1c-8ce7-75fe43bbd14c';

interface WebhookTest {
  id: string;
  name: string;
  payload: any;
}

const webhookTests: WebhookTest[] = [
  {
    id: 'start',
    name: 'Lead Generation Started',
    payload: {
      action: 'lead_generation_started',
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
      jobId: 'test-job-456',
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
      jobId: 'test-job-456',
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
      jobId: 'test-job-789',
      status: 'failed',
      userId: 'test-user-123',
      error: 'API rate limit exceeded',
      message: 'Test lead generation failed'
    }
  }
];

export const WebhookTester = () => {
  const [results, setResults] = useState<{[key: string]: 'pending' | 'success' | 'error' | null}>({});
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          N8N Webhook Tester
        </CardTitle>
        <CardDescription>
          Test webhook calls to your N8N workflow without triggering full lead generation
        </CardDescription>
        <div className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
          {N8N_WEBHOOK_URL}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
};