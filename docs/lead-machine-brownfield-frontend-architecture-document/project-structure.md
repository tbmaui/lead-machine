# Project Structure

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
