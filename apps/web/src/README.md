# Project Directory Structure

## Overview

This document describes the organization of the project's source code.

## Directory Structure

### `/src` - Source Code Root

- **app/** - Next.js app directory
    - `(auth)/` - Authentication routes
    - `(shop)/` - Shopping routes
    - `(cms)/` - CMS routes

- **components/** - React components
    - `ui/` - Base UI components
    - `features/` - Feature-specific components
    - `layouts/` - Layout components
    - `shared/` - Shared business components

- **lib/** - Core libraries and configurations
    - `api/` - API client setup
    - `graphql/` - GraphQL setup
    - `config/` - App configurations

- **store/** - State management
    - `slices/` - Redux slices
    - `hooks/` - Redux hooks

- **types/** - TypeScript types
    - `generated/` - Generated GraphQL types
    - `common/` - Common type definitions

- **utils/** - Utility functions
    - `api/` - API utilities
    - `helpers/` - Helper functions
    - `validation/` - Validation utilities

- **hooks/** - Custom React hooks
    - `api/` - API-related hooks
    - `common/` - Common hooks

- **providers/** - React context providers

### `/public` - Static Files

- `images/` - Image assets
- `fonts/` - Font files

### `/tests` - Test Files

- `unit/` - Unit tests
- `integration/` - Integration tests
- `e2e/` - End-to-end tests

### `/docs` - Documentation

- `api/` - API documentation
- `components/` - Component documentation

### `/config` - Configuration Files

- `env/` - Environment configurations
- `build/` - Build configurations

## Import Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
// Examples
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/api/useAuth';
import { Product } from '@/types/generated/graphql';
```