# Lead Machine Frontend Architecture Document

## Template and Framework Selection

Based on the existing Node.js codebase, this architecture will use a modern React-based stack to build the new user interface.

-   **Frontend Framework:** React
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **UI Component Library:** shadcn/ui
-   **Build Tool:** Vite

### Change Log

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-08-21 | 1.0 | Initial draft of the frontend architecture based on PRD and user feedback. | Sally |

## Frontend Tech Stack

This is the definitive technology selection for the frontend, synchronized with the main architecture document.

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| Frontend Framework | React | latest | Building interactive UI components | A component-based library well-suited for SPAs and reusable UI. |
| Language | TypeScript | latest | Type safety for enhanced code quality | Adds static typing to JavaScript, reducing bugs and improving tooling. |
| Styling | Tailwind CSS | latest | Utility-first CSS framework | Enables rapid UI development and customization directly in the markup. |
| UI Component Library | shadcn/ui | latest | Accessible and customizable components | Provides headless components that are easy to customize for a unique design. |
| Build Tool | Vite | latest | Fast development server and build process | Offers a fast development experience with features like Hot Module Replacement (HMR). |

## Project Structure

The project structure will follow a modular pattern that is scalable and easy for developers and AI tools to navigate.

```plaintext
/project-root
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── custom/         # Our numorphism-style components
│   │   │   ├── Button.tsx
│   │   │   └── ProgressBar.tsx
│   ├── pages/              # Main application pages
│   │   └── LeadsPage.tsx
│   ├── api/                # API service layer for backend communication
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # Global styles and Tailwind config
│   ├── utils/              # Utility functions
│   └── main.tsx            # Application entry point
└── docs/
    ├── prd.md
    └── front-end-spec.md
	
##Component Template

A basic component template following React and TypeScript best practices.

TypeScript

import React from 'react';

interface ComponentProps {
  // Define props here
}

export function ComponentName({}: ComponentProps) {
  return (
    <div>
      {/* Component content */}
    </div>
  );
}
### Naming Conventions

Components: PascalCase (e.g., UserProfile.tsx).

Hooks: camelCase with a 'use' prefix (e.g., useAuth.ts).

Files: kebab-case for general files (e.g., progress-bar.tsx).

### State Management
The project's state will be managed using a simple, scalable approach appropriate for a single-page application.

### Store Structure

This is an example structure. The specifics will be determined by the complexity of the data needs, but this is a solid start.

Plaintext

/src
└── stores/
    ├── leadsStore.ts
    └── progressStore.ts

### State Management Template
TypeScript

import { create } from 'zustand';

interface LeadsState {
  leads: any[];
  isLoading: boolean;
  setLeads: (newLeads: any[]) => void;
  setLoading: (status: boolean) => void;
}

export const useLeadsStore = create<LeadsState>((set) => ({
  leads: [],
  isLoading: false,
  setLeads: (newLeads) => set({ leads: newLeads }),
  setLoading: (status) => set({ isLoading: status }),
}));

## API Integration

The API integration layer will abstract the fetching and handling of data, ensuring a clean separation of concerns.

### Service Template

TypeScript

// src/api/leadsService.ts
import apiClient from './apiClient';

export const fetchLeads = async (query: string) => {
  try {
    const response = await apiClient.get(`/leads?q=${query}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    throw error;
  }
};

### API Client Configuration

TypeScript

// src/api/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling
    if (error.response?.status === 401) {
      // Handle unauthorized errors
    }
    return Promise.reject(error);
  },
);

export default apiClient;

## Routing

For this single-page application, routing will be handled by a single LeadsPage component.

### Route Configuration

Routing will be handled by the single main.tsx entry point that renders the LeadsPage component.

## Styling Guidelines

### Styling Approach

Utility-First: We will primarily use Tailwind CSS for all styling.

Component Styling: Custom components will be styled using Tailwind classes, with minimal or no custom CSS files.

Numporphism Style: This will be achieved by carefully combining multiple box-shadows, gradients, and subtle color shifts.

Global Theme Variables
CSS

:root {
  --color-primary-light: #FFD700;
  --color-primary-dark: #32CD32;
  --color-neutral-light: #f0f0f0;
  --color-neutral-dark: #2d3748;
}

## Testing Requirements

### Component Test Template

TypeScript

// src/components/custom/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with correct text', () => {
  render(<Button>Click Me</Button>);
  const buttonElement = screen.getByText(/Click Me/i);
  expect(buttonElement).toBeInTheDocument();
});

### Testing Best Practices

Unit Tests: Test individual components in isolation.

Integration Tests: Test component interactions to ensure they work together correctly.

E2E Tests: Not required for this project scope.

Coverage Goals: Aim for 80% code coverage on all new and modified files.

Test Structure: Use the Arrange-Act-Assert pattern for all tests.

Mock External Dependencies: Mock API calls to ensure tests are fast and reliable.

## Environment Configuration

The application will require environment variables for API base URLs.

Bash

# .env.local
VITE_API_BASE_URL="http://localhost:3000/api"
Frontend Developer Standards
Critical Coding Rules
Type Sharing: Ensure that types shared between the frontend and backend are defined consistently.

API Calls: All API calls must be made through the service layer, never directly from components.

State Updates: Never mutate state directly; always use the state management patterns defined.

## Quick Reference

Dev Server: npm run dev

Build: npm run build

Test: npm run test

Lint: npm run lint

## Next Steps

After completing the Frontend Architecture:

This document will be reviewed with the Product Owner.

The frontend project structure will be set up.

Story implementation will begin with the Dev agent.

I will provide a prompt to hand off to the Product Owner for the final validation step.