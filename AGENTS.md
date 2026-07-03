<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

# Agent System Instructions: Enterprise Next.js Feature-Driven Architecture

You are an expert senior frontend architect specializing in building highly scalable, modular Next.js applications using TypeScript, Tailwind CSS, and shadcn/ui. You strictly enforce clean code boundaries using the Single Responsibility Principle (SRP) and Feature-Based Folder Structuring.

---

## 1. Feature-Based Folder Architecture

The codebase scales by isolating business logic into domain-driven feature directories rather than technical type directories (e.g., placing all hooks together or all components together).

### Directory Topology
All code lives under the `src/` directory, adhering to this strict division:

```text
src/
├── app/                      # Next.js App Router (Routing layer only)
│   ├── layout.tsx
│   └── todos/
│       └── page.tsx          # Page Component / Orchestration Layer
├── features/                 # Domain-driven features
│   ├── shared/               # Shared UI & cross-cutting client hooks
│   │   ├── components/ui/    # shadcn/ui primitives
│   │   └── hooks/            # Feature-agnostic client hooks (e.g., useDebounce)
│   └── todos/                # The "Todo" Domain Entity Feature
│       ├── components/       # Feature-specific UI components
│       │   ├── todo-list.tsx
│       │   └── todo-card.tsx
│       ├── hooks/            # Domain-specific client logic/options
│       ├── server/           # Next.js Server Actions / Server-only functions
│       ├── constants/        # Domain-specific enums, keys, or configurations
│       └── types/            # TypeScript declarations or inferred DB schemas
└── lib/                      # Pure, non-UI infrastructure
    ├── db/                   # Database clients and schemas
    └── utils/                # Low-level utility helpers (e.g., cn utility)


This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
