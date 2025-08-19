# Requirements

### Functional Requirements (FR)
1.  **FR1**: The user can input a search query and trigger the lead generation workflow.
2.  **FR2**: The UI displays real-time status updates received from N8N via Supabase during the workflow's progression.
3.  **FR3**: The UI displays the final list of leads in a well-formatted, responsive table.
4.  **FR4**: The lead results table contains all the data fields returned from the N8N scraper.
5.  **FR5**: The UI displays the search query inputs.

### Non-Functional Requirements (NFR)
1.  **NFR1**: The application's UI is styled in a new "Neumorphism" look and feel.
2.  **NFR2**: The UI is responsive and fits all content on one screen without requiring horizontal scrolling.
3.  **NFR3**: The status updates are displayed in a visually appealing and dynamic progress bar.
4.  **NFR4**: The UI is performant and does not lag or freeze when receiving real-time updates.

### Compatibility Requirements (CR)
1.  **CR1**: The new frontend UI must continue to send search queries to the N8N webhook without any breaking changes to the existing API contract.
2.  **CR2**: The UI must be compatible with the data schema provided by Supabase for both leads and status updates.
3.  **CR3**: The enhancement must maintain existing performance characteristics and not introduce new bottlenecks or latency.
