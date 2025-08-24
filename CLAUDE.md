# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a lead generation application built as a React frontend with Supabase backend integration. The application provides lead discovery, enrichment, and management capabilities through a modern web interface.

## Key Development Commands

- `npm run dev` - Start development server (runs on port 8080)
- `npm run build` - Production build
- `npm run build:dev` - Development build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run coverage` - Generate test coverage report

## Architecture Overview

### Frontend Stack
- **React** with TypeScript for type safety
- **Vite** as build tool with SWC for fast compilation
- **shadcn/ui** component library built on Radix UI
- **Tailwind CSS** for styling
- **React Router** for navigation
- **TanStack Query** for data fetching and caching
- **Vitest** for testing

### Backend Integration
- **Supabase** for database and real-time subscriptions
- **Supabase Edge Functions** for serverless backend logic
- **N8n integration** for lead generation workflows

## Directory Structure

```
src/
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   └── *.tsx          # Application components
├── hooks/             # Custom React hooks
├── integrations/      # Supabase client and types
├── lib/              # Utility functions
├── pages/            # Route components
└── utils/            # Additional utilities
```

## Key Components and Features

### Lead Generation System
- Lead generation jobs are managed through `useLeadGeneration` hook (`src/hooks/useLeadGeneration.ts`)
- Real-time job status updates via Supabase subscriptions
- Progress tracking with simulation for smooth UX during early job phases
- Integration with N8n workflows for external lead processing

### Database Schema
- `lead_gen_jobs` - Tracks lead generation job status and progress
- `leads` - Stores individual lead records with enriched data
- Real-time subscriptions for both tables

### Testing
- Tests use Vitest with jsdom environment
- Test files follow `*.test.tsx` naming convention
- Coverage focused on critical components like `LeadsTable.tsx`

## Development Guidelines

### State Management
- Uses React Query for server state
- Local state with React hooks
- Real-time updates through Supabase subscriptions

### Component Architecture
- Follows atomic design principles
- Uses shadcn/ui for consistent UI components
- Custom components in `/components` directory
- UI primitives in `/components/ui`

### TypeScript Usage
- Strict TypeScript configuration
- Database types generated from Supabase
- Custom types in component files and hooks

### Styling
- Tailwind CSS utility classes
- Component variants using `class-variance-authority`
- Responsive design patterns
- Dark mode support via `next-themes`

## Important Configuration Files

- `vite.config.ts` - Vite configuration with path aliases and test setup
- `tailwind.config.ts` - Tailwind configuration with custom theme
- `eslint.config.js` - ESLint rules (unused vars disabled for development)
- `components.json` - shadcn/ui component configuration

## Environment Requirements

The application expects Supabase configuration in the client, which is automatically generated. Real-time features depend on Supabase subscriptions being properly configured.