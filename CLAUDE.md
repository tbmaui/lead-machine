# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a lead generation application built as a React frontend with Supabase backend integration. The application provides lead discovery, enrichment, and management capabilities through a modern web interface.

## Key Development Commands

- `npm run dev` - Start development server (runs on port 8080)  
- `npm run build` - Production build
- `npm run build:dev` - Development build  
- `npm run build:prod` - Production build with environment validation
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run coverage` - Generate test coverage report
- `npm run env:check` - Validate environment variables

## Architecture Overview

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Vite** as build tool with SWC for fast compilation  
- **shadcn/ui** component library built on Radix UI
- **Tailwind CSS** for styling with custom neumorphic design system
- **React Router** for client-side navigation
- **TanStack Query** for data fetching, caching, and server state
- **Vitest** for unit testing with jsdom environment
- **Framer Motion** for animations

### Backend Integration
- **Supabase** for database, authentication, and real-time subscriptions
- **Supabase Edge Functions** for serverless backend logic
- **N8n integration** for automated lead generation workflows

### Key Architectural Patterns
- Real-time data synchronization with Supabase subscriptions
- Progress simulation for smooth UX during async operations
- Environment variable validation with built-in security checks
- Comprehensive error handling and user feedback

## Directory Structure

```
src/
├── components/         # React components
│   ├── ui/            # shadcn/ui base components
│   ├── auth/          # Authentication components
│   └── *.tsx          # Application-specific components  
├── hooks/             # Custom React hooks
├── integrations/      # Supabase client and types
├── lib/              # Utility functions and business logic
├── pages/            # Route components
└── utils/            # Additional helper utilities
```

## Critical System Components

### Lead Generation System (`src/hooks/useLeadGeneration.ts`)
- Manages lead generation job lifecycle with real-time updates
- Implements progress simulation for enhanced UX during job processing
- Handles job status transitions: `pending` → `processing` → `searching` → `enriching` → `validating` → `finalizing` → `completed`
- Features intelligent progress tracking that merges real backend updates with simulated intermediate steps
- Automatic subscription management for real-time job and lead updates

### Status Management (`src/lib/status.ts`) 
- Centralized status-to-progress mapping for consistent UI feedback
- Defines allowed job statuses and progress percentages
- Used throughout the application for status validation and progress display

### Environment Validation (`src/lib/env-validation.ts`, `vite.config.ts`)
- Built-in validation for required environment variables
- Prevents builds with missing or invalid Supabase credentials  
- Security-focused validation of URL formats and JWT tokens

### Database Schema Integration
- `lead_gen_jobs` table for tracking job status and progress
- `leads` table for storing enriched lead data with LinkedIn integration
- Real-time subscriptions for both job updates and incoming leads

## Development Workflow

### Environment Setup
1. Copy environment variables from Supabase project
2. Run `npm run env:check` to validate configuration
3. Start development with `npm run dev`

### Testing Strategy
- Unit tests for critical business logic (hooks, utilities)
- Component testing for complex UI interactions
- Coverage reporting focused on `LeadsTable.tsx` and core hooks
- Run tests with `npm run test` or `npm run test:watch` for continuous testing

### Code Quality
- ESLint configuration with React and TypeScript rules
- Unused variables disabled during development for flexibility
- TypeScript strict mode enabled for type safety
- Consistent code formatting and conventions

## Key Features Implementation

### Real-time Lead Generation
- Uses Supabase real-time subscriptions for instant job status updates  
- Progress simulation provides smooth UX during initial job phases
- Automatic error handling and user notifications via toast system
- Polling fallback mechanism for reliability

### Authentication System
- Supabase Auth integration with protected routes
- Role-based access control for lead generation features
- Authenticated layout components with proper state management

### Data Export and Management  
- Export functionality for lead data in multiple formats
- Lead scoring and qualification system
- Advanced filtering and search capabilities in leads table
- Quick-jump links to LinkedIn profiles and company websites

## Important Configuration Files

- `vite.config.ts` - Build configuration with environment validation, path aliases, and test setup
- `tailwind.config.ts` - Custom theme configuration with neumorphic design tokens  
- `eslint.config.js` - Code quality rules optimized for development workflow
- `components.json` - shadcn/ui component configuration and styling preferences
- `supabase/config.toml` - Supabase project configuration and edge functions

## Production Deployment

### Environment Requirements
- `VITE_SUPABASE_URL` - Supabase project URL (validated format)
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key (validated JWT)
- Optional: `VITE_FEATURE_HERO_V2` - Feature flag for UI variants

### Pre-deployment Validation
- Run `npm run env:check` to validate environment configuration
- Execute `npm run build:prod` to ensure production build succeeds
- Run full test suite with `npm run test` and `npm run coverage`
- Verify all environment variables are properly configured in deployment platform

Refer to `DEPLOYMENT.md` for comprehensive production deployment instructions and security best practices.