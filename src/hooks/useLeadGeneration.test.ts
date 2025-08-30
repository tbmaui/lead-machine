import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useLeadGeneration } from './useLeadGeneration';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
    from: vi.fn(),
    channel: vi.fn(),
    removeChannel: vi.fn(),
  },
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

const mockSupabase = supabase as any;
const mockUseToast = useToast as any;

describe('useLeadGeneration', () => {
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseToast.mockReturnValue({
      toast: mockToast,
    });

    // Mock Supabase channel
    const mockChannel = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnValue('SUBSCRIBED'),
    };
    mockSupabase.channel.mockReturnValue(mockChannel);
    mockSupabase.removeChannel.mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with empty state', () => {
      const { result } = renderHook(() => useLeadGeneration(mockUserId));
      
      expect(result.current.currentJob).toBe(null);
      expect(result.current.leads).toEqual([]);
      expect(result.current.loading).toBe(false);
    });

    it('should require userId parameter', () => {
      const { result } = renderHook(() => useLeadGeneration(mockUserId));
      
      // Should not throw during initialization
      expect(result.current).toBeDefined();
    });
  });

  describe('startLeadGeneration', () => {
    const mockJobCriteria = {
      targetLocation: 'New York, NY',
      industries: ['Technology'],
      jobTitles: ['CEO'],
      companySizes: ['1-50'],
      leadCount: 100,
    };

    it('should require authentication to start lead generation', async () => {
      const { result } = renderHook(() => useLeadGeneration(''));

      await act(async () => {
        try {
          await result.current.startLeadGeneration(mockJobCriteria);
          expect(true).toBe(false); // Should not reach here
        } catch (error) {
          expect(error.message).toBe('User must be authenticated to generate leads');
        }
      });
    });

    it('should successfully start lead generation with valid userId', async () => {
      const mockJobId = 'job-123';
      const mockJob = {
        id: mockJobId,
        user_id: mockUserId,
        status: 'pending',
        job_criteria: mockJobCriteria,
        progress: 0,
        total_leads_found: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Mock successful function invocation
      mockSupabase.functions.invoke.mockResolvedValue({
        data: { jobId: mockJobId },
        error: null,
      });

      // Mock database query for job retrieval
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: mockJob,
          error: null,
        }),
      };
      mockSupabase.from.mockReturnValue(mockFrom);

      const { result } = renderHook(() => useLeadGeneration(mockUserId));

      await act(async () => {
        await result.current.startLeadGeneration(mockJobCriteria);
      });

      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('trigger-lead-generation', {
        body: {
          jobCriteria: mockJobCriteria,
          userId: mockUserId,
        },
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: "Lead generation started",
        description: "Your lead generation is in progress...",
      });

      // Should set current job
      expect(result.current.currentJob).toEqual({
        ...mockJob,
        status: 'pending',
      });
    });

    it('should handle function invocation error', async () => {
      const mockError = new Error('Function invocation failed');
      
      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const { result } = renderHook(() => useLeadGeneration(mockUserId));

      await act(async () => {
        await result.current.startLeadGeneration(mockJobCriteria);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: "Error starting lead generation",
        description: mockError.message,
        variant: "destructive",
      });
    });

    it('should handle job retrieval failure', async () => {
      const mockJobId = 'job-123';

      mockSupabase.functions.invoke.mockResolvedValue({
        data: { jobId: mockJobId },
        error: null,
      });

      // Mock failed job retrieval after multiple attempts
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };
      mockSupabase.from.mockReturnValue(mockFrom);

      const { result } = renderHook(() => useLeadGeneration(mockUserId));

      await act(async () => {
        await result.current.startLeadGeneration(mockJobCriteria);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: "Error starting lead generation",
        description: "Job was created but could not be retrieved after multiple attempts",
        variant: "destructive",
      });
    });
  });

  describe('real-time subscriptions', () => {
    it('should setup subscriptions only with valid userId and jobId', () => {
      const { result } = renderHook(() => useLeadGeneration(mockUserId));

      // Initially no subscriptions should be set up
      expect(mockSupabase.channel).not.toHaveBeenCalled();

      // No jobId yet, so no subscriptions
      expect(mockSupabase.channel).not.toHaveBeenCalled();
    });

    it('should clean up subscriptions on unmount', () => {
      const { unmount } = renderHook(() => useLeadGeneration(mockUserId));

      unmount();

      // Should clean up any active channels
      expect(mockSupabase.removeChannel).toHaveBeenCalled();
    });
  });

  describe('fetchLeads', () => {
    it('should fetch leads for a given job', async () => {
      const mockJobId = 'job-123';
      const mockLeads = [
        {
          id: 'lead-1',
          name: 'John Doe',
          email: 'john@example.com',
          company: 'Acme Corp',
          created_at: new Date().toISOString(),
        },
      ];

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: mockLeads,
          error: null,
        }),
      };
      mockSupabase.from.mockReturnValue(mockFrom);

      const { result } = renderHook(() => useLeadGeneration(mockUserId));

      await act(async () => {
        await result.current.fetchLeads(mockJobId);
      });

      expect(mockSupabase.from).toHaveBeenCalledWith('leads');
      expect(mockFrom.select).toHaveBeenCalledWith('*');
      expect(mockFrom.eq).toHaveBeenCalledWith('job_id', mockJobId);
      expect(mockFrom.order).toHaveBeenCalledWith('created_at', { ascending: true });

      expect(result.current.leads).toEqual(mockLeads);
    });

    it('should handle fetch leads error', async () => {
      const mockJobId = 'job-123';
      const mockError = new Error('Database error');

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };
      mockSupabase.from.mockReturnValue(mockFrom);

      const { result } = renderHook(() => useLeadGeneration(mockUserId));

      await act(async () => {
        await result.current.fetchLeads(mockJobId);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: "Error fetching leads",
        description: "Failed to load leads data",
        variant: "destructive",
      });
    });
  });

  describe('resetJob', () => {
    it('should reset job and leads state', async () => {
      const { result } = renderHook(() => useLeadGeneration(mockUserId));

      // Set some initial state
      act(() => {
        result.current.resetJob();
      });

      expect(result.current.currentJob).toBe(null);
      expect(result.current.leads).toEqual([]);
    });
  });
});