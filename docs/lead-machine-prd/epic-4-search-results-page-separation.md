# Epic 4: Search & Results Page Separation

**Epic Goal**: Transform the existing single-page lead generation experience into a compelling two-page user journey that improves conversion and user experience while maintaining 100% compatibility with existing backend systems.

**Brownfield Constraints**: This epic operates on existing, working code. All changes must be backward compatible and preserve existing functionality. No breaking changes to Supabase integrations, N8N workflows, or authentication systems.

**Integration Requirements**: 
- Must maintain full compatibility with existing Supabase data model
- Must preserve N8N workflow triggers without modification
- Must maintain existing authentication and user management
- Must preserve all existing real-time subscriptions and state management

## Story Structure

### Story 4.1: Refactor Landing Page to Remove Search Functionality (Brownfield Safe)

As a user visiting the landing page, I want to see compelling information about the lead generation tool, so that I understand the value and can proceed to search when ready.

**Acceptance Criteria**
1. **BC1**: All existing landing page content (Hero, Overview, LeadScore, QuickStart) remains intact and functional
2. **BC2**: LeadGenForm component is cleanly removed from Index.tsx without breaking imports or state
3. **BC3**: Two prominent CTAs ("Get Leads Now" and "Try It Free") navigate to new /search route
4. **BC4**: No console errors or broken functionality after refactor
5. **BC5**: All existing responsive behavior and styling preserved

**Brownfield Safety Notes**:
- Extract, don't delete LeadGenForm component - it will be reused
- Preserve all existing prop interfaces for backward compatibility
- Test thoroughly on all existing screen sizes and browsers

### Story 4.2: Create Dedicated Search Page (Brownfield Integration)

As a user ready to generate leads, I want a focused page for searching and viewing results, so that I can complete my lead generation workflow without distractions.

**Acceptance Criteria**
1. **BC1**: New /search route renders without affecting existing routes
2. **BC2**: LeadGenForm functionality works exactly as before (all inputs, validation, submission)
3. **BC3**: Real-time progress updates function identically to current implementation
4. **BC4**: Results display (LeadGenResults) works exactly as before
5. **BC5**: All existing useLeadGeneration hook functionality preserved
6. **BC6**: Authentication flow works identically to current implementation
7. **BC7**: Back navigation to landing page works without losing state

**Brownfield Safety Notes**:
- Reuse existing components without modification where possible
- Preserve all existing hook interfaces and state management
- Maintain existing Supabase subscription patterns

### Story 4.3: Implement State Persistence Between Pages (Brownfield Enhancement)

As a user navigating between pages, I want my search progress to persist, so that I don't lose my work if I navigate away.

**Acceptance Criteria**
1. **BC1**: Existing search functionality continues to work if state persistence fails
2. **BC2**: Search parameters survive page refresh using URL parameters
3. **BC3**: Job progress persists across navigation using session storage
4. **BC4**: Form state restoration works without breaking existing form validation
5. **BC5**: Real-time subscriptions continue working during page transitions
6. **BC6**: No impact on existing authentication or session management

**Brownfield Safety Notes**:
- Add persistence as enhancement layer, not replacement of existing state
- Graceful degradation if storage APIs unavailable
- Preserve existing useLeadGeneration hook interface

### Story 4.4: Enhance Landing Page CTAs (Brownfield UX Enhancement)

As a user on the landing page, I want clear, compelling calls-to-action, so that I'm motivated to start generating leads.

**Acceptance Criteria**
1. **BC1**: Enhanced CTAs don't break existing layout or responsive behavior
2. **BC2**: Primary CTA prominently displayed in hero section
3. **BC3**: "Try It Free" pre-fills demo search parameters
4. **BC4**: All CTAs maintain neumorphic design consistency
5. **BC5**: Mobile experience enhanced without breaking existing touch interactions

**Brownfield Safety Notes**:
- Add CTAs as enhancements to existing components
- Preserve all existing styling classes and responsive breakpoints
- Test on all supported devices and browsers

### Story 4.5: Add Search Page Navigation & Layout (Brownfield Polish)

As a user on the search page, I want clear navigation and focused layout, so that I can complete my search efficiently.

**Acceptance Criteria**
1. **BC1**: Navigation enhancements don't conflict with existing routing
2. **BC2**: Clear "Back to Home" navigation preserves browser history
3. **BC3**: Layout optimization doesn't break existing component rendering
4. **BC4**: Progress indicators integrate seamlessly with existing job status updates
5. **BC5**: All accessibility features preserved and enhanced

**Brownfield Safety Notes**:
- Layer navigation enhancements over existing layout system
- Preserve existing component hierarchy and prop interfaces
- Maintain existing accessibility compliance

## Risk Mitigation Strategy

**High-Risk Areas (Extra Brownfield Care Required)**:
- useLeadGeneration hook modifications
- React Router integration with existing auth flows  
- State management changes affecting real-time subscriptions

**Testing Strategy**:
- Comprehensive regression testing after each story
- Parallel testing environments for comparison
- Rollback plan for each story implementation

**Success Metrics**:
- Zero breaking changes to existing functionality
- 15%+ improvement in landing page conversion
- Maintained or improved performance metrics