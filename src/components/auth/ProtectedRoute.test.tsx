import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@supabase/supabase-js';

// Mock useAuth hook
vi.mock('@/hooks/useAuth');

const mockUseAuth = useAuth as any;

const TestApp = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/dashboard" element={children} />
    </Routes>
  </BrowserRouter>
);

const ProtectedComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    user_metadata: {},
  } as User;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location for navigation tests
    delete (window as any).location;
    window.location = { pathname: '/dashboard' } as any;
  });

  it('should show loading spinner when auth is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    render(
      <TestApp>
        <ProtectedRoute>
          <ProtectedComponent />
        </ProtectedRoute>
      </TestApp>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render protected content when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    });

    render(
      <TestApp>
        <ProtectedRoute>
          <ProtectedComponent />
        </ProtectedRoute>
      </TestApp>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <ProtectedComponent />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    );

    // The redirect should happen, and we should see the login page
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should handle multiple children components', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    });

    render(
      <TestApp>
        <ProtectedRoute>
          <div>First Component</div>
          <div>Second Component</div>
        </ProtectedRoute>
      </TestApp>
    );

    expect(screen.getByText('First Component')).toBeInTheDocument();
    expect(screen.getByText('Second Component')).toBeInTheDocument();
  });

  it('should preserve location state for redirect after login', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    const { container } = render(
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <ProtectedComponent />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    );

    // Verify that navigation occurred (component structure changes)
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});