# Earthquake Tracker

A full-stack application for tracking and managing earthquake data built with TypeScript, Node.js, Next.js, and Apollo GraphQL.

## Architecture Overview

### Backend Architecture

- **Framework**: Express.js with Apollo Server 4
- **Database**: PostgreSQL with Prisma ORM
- **API**: GraphQL
- **Data Import**: CSV parsing functionality

### Frontend Architecture

- **Framework**: Next.js with TypeScript
- **Data Fetching**: Apollo Client
- **State Management**: React hooks and Apollo Cache
- **Styling**: TailwindCSS

## Project Structure

```
earthquake-tracker/
├── packages/
│   ├── backend/                # Backend application
│   │   ├── src/
│   │   │   ├── graphql/       # GraphQL schema and resolvers
│   │   │   ├── scripts/       # Data import scripts
│   │   │   └── types/         # TypeScript types
│   │   └── prisma/            # Database schema and migrations
│   ├── frontend/              # Frontend application
│   │   └── src/
│   │       ├── components/    # React components
│   │       ├── lib/          # Utilities and types
│   │       └── app/          # Next.js pages
│   └── shared-types/          # Shared TypeScript interfaces
```

## Setup and Installation

### Prerequisites

- Node.js (v18 or later)
- pnpm (v8 or later)
- PostgreSQL

### Development Setup

1. Clone and Install:

```bash
git clone https://github.com/vkuprin/earthquake-tracker
cd earthquake-tracker
pnpm install
```

2. Database Setup:

```bash
# In packages/backend
cd packages/backend

# Setup .env file
echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/earthquake_db\"" > .env

# Run migrations
pnpm prisma migrate dev

# Import initial data
nx run backend:seed
```

3. Start Development Servers:

```bash
# Start backend (http://localhost:4000)
nx serve backend

# Start frontend (http://localhost:3000)
nx serve frontend
```

## API Documentation

### GraphQL Schema

#### Types

```graphql
type Earthquake {
  id: ID!
  location: String!
  magnitude: Float!
  date: String!
  createdAt: String!
  updatedAt: String!
}

input EarthquakeInput {
  location: String!
  magnitude: Float!
  date: String!
}

input UpdateEarthquakeInput {
  location: String
  magnitude: Float
  date: String
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  totalCount: Int!
}

type EarthquakesResponse {
  edges: [Earthquake!]!
  pageInfo: PageInfo!
}
```

#### Queries

```graphql
# Get paginated earthquakes with optional filtering
query GetEarthquakes($filter: EarthquakeFilter, $pagination: PaginationInput) {
  earthquakes(filter: $filter, pagination: $pagination) {
    edges {
      id
      location
      magnitude
      date
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      totalCount
    }
  }
}

# Get single earthquake by ID
query GetEarthquake($id: ID!) {
  earthquake(id: $id) {
    id
    location
    magnitude
    date
  }
}
```

#### Mutations

```graphql
# Create new earthquake
mutation CreateEarthquake($input: EarthquakeInput!) {
  createEarthquake(input: $input) {
    id
    location
    magnitude
    date
  }
}

# Update existing earthquake
mutation UpdateEarthquake($id: ID!, $input: UpdateEarthquakeInput!) {
  updateEarthquake(id: $id, input: $input) {
    id
    location
    magnitude
    date
  }
}

# Delete earthquake
mutation DeleteEarthquake($id: ID!) {
  deleteEarthquake(id: $id) {
    id
  }
}
```

### Frontend Components

#### EarthquakeList

Main component for displaying earthquakes with pagination and filtering.

```typescript
interface EarthquakeListProps {
  filters: FilterState;
}
```

#### EarthquakeForm

Form component for creating and updating earthquakes.

```typescript
interface EarthquakeFormProps {
  earthquake?: Earthquake;
  onClose: () => void;
  onSuccess: () => void;
}
```

#### FilterPanel

Component for handling earthquake filtering.

```typescript
interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}
```

## Database Schema

```prisma
model Earthquake {
  id        String   @id @default(uuid())
  location  String
  magnitude Float
  date      DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Error Handling

### Backend

- GraphQL errors are propagated with proper error codes
- Database errors are caught and mapped to user-friendly messages
- Invalid input validation is handled at the GraphQL schema level

### Frontend

- Apollo error states are handled in components
- Loading states are displayed during data fetches
- Form validation provides immediate user feedback
- Network errors are caught and displayed to users

## Available Scripts

### Root Directory

```bash
pnpm lint          # Run linting across all packages
pnpm typecheck     # Run type checking
pnpm test          # Run tests
```

### Backend

```bash
nx serve backend   # Start development server
nx build backend   # Build for production
nx test backend    # Run backend tests
nx run backend:seed # Import CSV data
```

### Frontend

```bash
nx serve frontend  # Start development server
nx build frontend  # Build for production
nx test frontend   # Run frontend tests
```

## Deployment

1. Build all packages:

```bash
pnpm build
```

2. Backend deployment:

```bash
cd packages/backend
# Set production environment variables
# Run migrations
prisma migrate deploy
# Start server
node dist/main.js
```

3. Frontend deployment:

```bash
cd packages/frontend
# Build Next.js application
next build
# Start production server
next start
```
