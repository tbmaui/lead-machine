import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroSection } from './hero-section';

describe('HeroSection', () => {
  it('renders the hero section with enhanced styling', () => {
    render(<HeroSection />);
    
    // Check for main heading
    expect(screen.getByText('Welcome to the Lead Machine')).toBeInTheDocument();
    
    // Check for enhanced badge
    expect(screen.getByText('AMERICA\'S PREMIER LEAD DISCOVERY PLATFORM')).toBeInTheDocument();
    
    // Check for key messaging
    expect(screen.getByText(/High-efficiency, enhanced prospecting/)).toBeInTheDocument();
    expect(screen.getByText(/Generate 1-1000 verified and enriched SMB/)).toBeInTheDocument();
  });

  it('displays all three feature cards', () => {
    render(<HeroSection />);
    
    // Check for feature cards
    expect(screen.getByText('Cross-Platform Verification')).toBeInTheDocument();
    expect(screen.getByText('Real-Time Enrichment')).toBeInTheDocument();
    expect(screen.getByText('CRM-Ready Export')).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    render(<HeroSection />);
    
    // Check for proper heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Welcome to the Lead Machine');
    
    // Check for feature card headings
    expect(screen.getByRole('heading', { level: 4, name: 'Cross-Platform Verification' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Real-Time Enrichment' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'CRM-Ready Export' })).toBeInTheDocument();
  });

  it('applies neumorphism styling classes', () => {
    const { container } = render(<HeroSection />);
    
    // Check for neumorphism classes on hero cards and features
    expect(container.querySelector('.neu-hero-card')).toBeInTheDocument();
    expect(container.querySelectorAll('.neu-hero-feature')).toHaveLength(3);
  });
});