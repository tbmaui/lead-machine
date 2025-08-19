# Project Structure

```text
project-root/
├── public/                 # Static assets like images and fonts
├── src/                    # Source code directory
│   ├── assets/             # Images, icons, etc.
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # shadcn-ui components
│   │   └── custom/         # Project-specific custom components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── services/           # API client services
│   ├── styles/             # Global styles and themes
│   └── App.tsx             # Main application component
├── .env.local              # Local environment variables
├── package.json
├── tailwind.config.js
└── tsconfig.json