# Developer Guide

This repository uses a component-driven structure. Folders that are intentionally empty contain a `README.md` describing their purpose so they are not left empty in Git.

Basic layout:
- client/: Frontend React app
  - core/: App entry, routing, providers
  - layout/: Layout components (Navbar, ThemeToggle, etc.)
  - components/: App-level shared components
  - modules/: Feature modules (auth, notes, admin, home)
  - ui-kit/: Primitive atoms, molecules, and utilities for the design system
- server/: Server-side integrations and database migrations
- public/: Static assets

If you create new folders, add a short `README.md` explaining the folder's role or add a `.gitkeep` to keep it in the repository.