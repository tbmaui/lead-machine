import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { AuthError } from '@supabase/supabase-js';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
  },
}));

const mockSupabase = supabase as any;

describe('useAuth', () => {
  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    user_metadata: {},
  };

  const mockSession = {
    user: mockUser,
    access_token: 'mock-access-token',
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup default mock implementations
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with loading state', () => {
      const { result } = renderHook(() => useAuth());
      
      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBe(null);
    });

    it('should load existing session on mount', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.user).toEqual(mockUser);
      });
    });

    it('should handle no existing session', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.user).toBe(null);
      });
    });
  });

  describe('signIn', () => {
    it('should successfully sign in a user', async () => {
      const { result } = renderHook(() => useAuth());

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      let authResult: any;
      await act(async () => {
        authResult = await result.current.signIn('test@example.com', 'password123');
      });

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(authResult).toEqual({
        user: mockUser,
        error: null,
      });
    });

    it('should handle sign in error', async () => {
      const { result } = renderHook(() => useAuth());

      const mockError: AuthError = {
        message: 'Invalid credentials',
        name: 'AuthError',
      } as AuthError;

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });

      let authResult: any;
      await act(async () => {
        authResult = await result.current.signIn('test@example.com', 'wrongpassword');
      });

      expect(authResult).toEqual({
        user: null,
        error: mockError,
      });
    });
  });

  describe('signUp', () => {
    it('should successfully sign up a user', async () => {
      const { result } = renderHook(() => useAuth());

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      let authResult: any;
      await act(async () => {
        authResult = await result.current.signUp('test@example.com', 'password123');
      });

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(authResult).toEqual({
        user: mockUser,
        error: null,
      });
    });

    it('should handle sign up error', async () => {
      const { result } = renderHook(() => useAuth());

      const mockError: AuthError = {
        message: 'Email already registered',
        name: 'AuthError',
      } as AuthError;

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });

      let authResult: any;
      await act(async () => {
        authResult = await result.current.signUp('test@example.com', 'password123');
      });

      expect(authResult).toEqual({
        user: null,
        error: mockError,
      });
    });
  });

  describe('signOut', () => {
    it('should successfully sign out', async () => {
      const { result } = renderHook(() => useAuth());

      mockSupabase.auth.signOut.mockResolvedValue({
        error: null,
      });

      let signOutResult: any;
      await act(async () => {
        signOutResult = await result.current.signOut();
      });

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(signOutResult).toEqual({ error: null });
    });

    it('should handle sign out error', async () => {
      const { result } = renderHook(() => useAuth());

      const mockError: AuthError = {
        message: 'Sign out failed',
        name: 'AuthError',
      } as AuthError;

      mockSupabase.auth.signOut.mockResolvedValue({
        error: mockError,
      });

      let signOutResult: any;
      await act(async () => {
        signOutResult = await result.current.signOut();
      });

      expect(signOutResult).toEqual({ error: mockError });
    });
  });

  describe('resetPassword', () => {
    it('should successfully send reset password email', async () => {
      const { result } = renderHook(() => useAuth());

      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        error: null,
      });

      let resetResult: any;
      await act(async () => {
        resetResult = await result.current.resetPassword('test@example.com');
      });

      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      expect(resetResult).toEqual({ error: null });
    });

    it('should handle reset password error', async () => {
      const { result } = renderHook(() => useAuth());

      const mockError: AuthError = {
        message: 'Email not found',
        name: 'AuthError',
      } as AuthError;

      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        error: mockError,
      });

      let resetResult: any;
      await act(async () => {
        resetResult = await result.current.resetPassword('nonexistent@example.com');
      });

      expect(resetResult).toEqual({ error: mockError });
    });
  });

  describe('auth state changes', () => {
    it('should handle auth state changes', async () => {
      let authChangeCallback: any;
      
      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authChangeCallback = callback;
        return {
          data: { subscription: { unsubscribe: vi.fn() } },
        };
      });

      const { result } = renderHook(() => useAuth());

      // Initial state
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.user).toBe(null);
      });

      // Simulate sign in event
      act(() => {
        authChangeCallback('SIGNED_IN', mockSession);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.loading).toBe(false);

      // Simulate sign out event
      act(() => {
        authChangeCallback('SIGNED_OUT', null);
      });

      expect(result.current.user).toBe(null);
      expect(result.current.loading).toBe(false);
    });
  });
});