import '@testing-library/jest-dom';

// Polyfill ResizeObserver for Recharts' ResponsiveContainer in jsdom
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = global.ResizeObserver || ResizeObserverMock;

