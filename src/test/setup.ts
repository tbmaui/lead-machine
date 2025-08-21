import '@testing-library/jest-dom';

// Polyfill ResizeObserver for Recharts' ResponsiveContainer in jsdom
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error test environment global
global.ResizeObserver = global.ResizeObserver || ResizeObserverMock;

