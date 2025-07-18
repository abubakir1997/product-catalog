# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript product catalog application built with Vite, featuring a modern stack including TailwindCSS, Zustand for state management, and shadcn/ui components. The app has a simple authentication flow and displays products from a mock API with data table functionality.

## Development Commands

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production (runs TypeScript check + Vite build)
- `pnpm lint` - Run ESLint to check code quality
- `pnpm preview` - Preview production build locally
- `pnpm shadcn` - Add new shadcn/ui components

## Architecture Overview

### State Management
- **Zustand stores** located in `src/store/`:
  - `auth.ts` - Simple authentication state (persisted to localStorage)
  - `catalog.ts` - Product catalog state with loading management

### Routing & Pages
- **App-level routing** handled in `src/App.tsx` with conditional rendering based on authentication
- **Pages** in `src/app/`:
  - `login/page.tsx` - Authentication page
  - `catalog/page.tsx` - Main product catalog with data table

### Data Layer
- **Mock API integration** in `src/mock-api/` using DummyJSON API
- **Type definitions** in `src/types/` for Product and API response models
- Products fetched with pagination, sorting, and filtering support

### Component Architecture
- **shadcn/ui components** in `src/components/ui/` (auto-generated, don't modify directly)
- **Custom components** in `src/components/` for app-specific functionality
- **Theme system** using next-themes with dark/light mode support

### Configuration
- **Path aliases** configured: `@/*` maps to `src/*`
- **TailwindCSS v4** with shadcn/ui integration
- **ESLint** with TypeScript, React hooks, and unused imports rules
- **Vite** with React SWC for fast refresh

## Key Implementation Details

### Adding shadcn/ui Components
Use `pnpm shadcn` to add new components. The configuration is in `components.json` with "new-york" style and neutral base color.

### State Updates
- Auth state persists to localStorage automatically
- Product loading states managed per-product in catalog store
- Use Zustand stores directly in components without additional providers

### Data Fetching
- Mock API calls in `src/mock-api/` abstract DummyJSON integration
- Products transformed from DummyJSON format to internal Product interface
- Pagination limit set to 10 items (configurable in `src/lib/constants.ts`)

### Styling Patterns
- TailwindCSS utility-first approach
- shadcn/ui component variants using class-variance-authority
- Theme-aware components using CSS variables