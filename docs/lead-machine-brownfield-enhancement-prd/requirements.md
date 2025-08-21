# Requirements

These requirements are based on my understanding of your existing system and the details you have provided. Please review carefully and confirm they align with your project's reality.

### Functional

1. **FR1:** The system shall display a horizontal progress bar in a numorphism style when a lead search is initiated. The bar must have a light yellow to green gradient and provide visual progress feedback.
2. **FR2:** The progress bar shall receive and display four distinct status updates from the backend: "Beginning lead search", "searching web, OSINT sources, for matching prospects", "Cross reference and data enrichment", and "Data validation via Regex, DQFS."
3. **FR3:** The system shall update the progress bar to a final state with a "Report ready" message upon completion of the lead search.
4. **FR4:** The system shall display a pie chart above the lead table, generated simultaneously with the table data.
5. **FR5:** The pie chart shall aggregate and display data based on lead titles, presence of a valid phone number, and presence of a valid email address.
6. **FR6:** The system shall assign points to leads based on their title, email, and phone number, and this scoring will be reflected in the pie chart.
7. **FR7:** The lead display table shall be overhauled to include additional columns that map to the results from the N8N workflow.
8. **FR8:** The overhauled lead table shall support dynamic sorting of its columns.
9. **FR9:** The overhauled lead table shall provide quick-jumping functionality for embedded URLs (e.g., website and LinkedIn).
10. **FR10:** The entire user interface shall be styled according to a new numorphism design, with specific gradient outlines on components.

### Non Functional

1. **NFR1:** The UI must maintain a smooth and responsive feel, even during long-running backend processes.
2. **NFR2:** The numorphism styling must be applied consistently across all UI elements, including buttons, cards, and input fields.
3. **NFR3:** The color palette and visual design of the page must reflect the brand's yellow-to-green color scheme.
4. **NFR4:** The application's performance should not degrade when rendering the new UI components and data tables.
5. **NFR5:** The entire UI, including all new components, must be implemented in a way that allows for easy maintenance and future enhancements.

### Compatibility Requirements

1. **CR1:** New features must not introduce any breaking changes to existing backend APIs.
2. **CR2:** Any data model changes required for the new features must be backward-compatible with the existing data structure.
3. **CR3:** The new UI/UX must maintain a consistent look and feel with any existing pages that are not being overhauled.
4. **CR4:** The new UI must seamlessly integrate with the existing Node.js backend without requiring a major architectural refactor.
