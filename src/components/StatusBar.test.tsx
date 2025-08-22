import { render, screen } from '@testing-library/react';
import { StatusBar } from './StatusBar';

// Disable animations by mocking useReducedMotion to true
vi.mock('@/hooks/useReducedMotion', () => ({ useReducedMotion: () => true }));
vi.mock('@/hooks/useAnimatedNumber', () => ({ useAnimatedNumber: (n: number) => n }));

describe('StatusBar', () => {
  it('renders validating label and 70% progress', () => {
    render(<StatusBar status={'validating'} progress={70} steps={["One","Two","Three"]} />);
    expect(screen.getByText('Validating results and de-duplicating...')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('renders finalizing label and 90% progress', () => {
    render(<StatusBar status={'finalizing'} progress={90} steps={["One","Two","Three"]} />);
    expect(screen.getByText('Finalizing results and preparing output...')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });
});


