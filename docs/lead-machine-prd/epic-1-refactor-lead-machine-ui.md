# Epic 1: Refactor Lead Machine UI

**Epic Goal**: To deliver a refined, Neumorphism-styled frontend UI that provides an excellent user experience, especially regarding the display of lead results and real-time status updates, without disrupting the existing backend integrations.

**Integration Requirements**: The new UI must be fully compatible with the existing Supabase data model for both leads and status updates. It must also continue to trigger the N8N workflow via the existing webhook without modification.

### Story 1.1: Setup and Theming

As a developer, I want to set up the new UI's foundation, so that all subsequent development can be built on the new style.

**Acceptance Criteria**
1.  **CR1**: The project is configured to use the `Neumorphism` style and supports both light and dark modes.
2.  **CR2**: Global styles and themes are defined in `Tailwind CSS`.

### Story 1.2: Implement Search Inputs

As a user, I want to enter search queries in a new UI, so that I can trigger the lead generation workflow.

**Acceptance Criteria**
1.  **FR1**: The UI contains a search input field and a search button.
2.  **FR5**: The search query inputs are styled according to the `Neumorphism` design.

### Story 1.3: Create and Animate Status Bar

As a user, I want to see the progress of the lead generation workflow, so that I know the system is working.

**Acceptance Criteria**
1.  **FR2**: The UI displays real-time status updates received from N8N via Supabase.
2.  **NFR3**: The status updates are displayed in a visually appealing and dynamic progress bar.
3.  **NFR4**: The UI remains performant and does not lag when receiving real-time updates.

### Story 1.4: Display Lead Results Table

As a user, I want to view the list of leads in a clear format, so that I can easily review the results.

**Acceptance Criteria**
1.  **FR3**: The UI displays the final list of leads in a well-formatted, responsive table.
2.  **FR4**: The table contains all the data fields returned from the N8N scraper.
3.  **NFR2**: The table fits all content on one screen without requiring horizontal scrolling.
