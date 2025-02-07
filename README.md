# Earthquake Tracker

A full-stack application for tracking and managing earthquake data using TypeScript, Node.js, Next.js, and Apollo GraphQL.

## Features

- GraphQL API for CRUD operations on earthquake data
- Data visualization with charts and statistics
- Filtering and pagination
- CSV data import functionality
- Responsive frontend interface

## Tech Stack

- **Backend**:

  - Node.js with Express
  - Apollo Server v4
  - Prisma ORM
  - PostgreSQL database
  - TypeScript

- **Frontend**:
  - Next.js
  - Apollo Client
  - Recharts for data visualization
  - TailwindCSS for styling
  - TypeScript

## Prerequisites

- Node.js (v18 or later)
- pnpm (v8 or later)
- PostgreSQL

## Setup Instructions

1. Clone the repository:

```bash
git clone <repository-url>
cd earthquake-tracker
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

Create `.env` file in packages/backend:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/earthquake_db"
```

4. Set up the database:

```bash
cd packages/backend
pnpm prisma migrate dev
pnpm prisma generate
```

5. Import initial data:

```bash
nx run backend:seed
```

6. Start the development servers:

In separate terminals:

```bash
# Start backend
nx serve backend

# Start frontend
nx serve frontend
```

7. Access the application:

- Frontend: http://localhost:3000
- GraphQL Playground: http://localhost:4000/graphql

## Project Structure

```
earthquake-tracker/
├── packages/
│   ├── backend/              # Backend application
│   │   ├── src/
│   │   │   ├── graphql/     # GraphQL schema and resolvers
│   │   │   ├── assets/      # CSV data
│   │   │   └── scripts/     # Seeding scripts
│   │   └── prisma/          # Database schema and migrations
│   ├── frontend/            # Frontend application
│   │   └── src/
│   │       ├── components/  # React components
│   │       └── app/        # Next.js pages
│   └── shared-types/        # Shared TypeScript types
└── README.md
```

## Available Scripts

- `nx serve backend` - Start the backend server
- `nx serve frontend` - Start the frontend development server
- `nx run backend:seed` - Import CSV data
- `nx lint` - Run linting
- `nx test` - Run tests

## API Documentation

### GraphQL Queries

```graphql
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
```

### GraphQL Mutations

```graphql
mutation CreateEarthquake($input: EarthquakeInput!) {
  createEarthquake(input: $input) {
    id
    location
    magnitude
    date
  }
}

mutation UpdateEarthquake($id: ID!, $input: UpdateEarthquakeInput!) {
  updateEarthquake(id: $id, input: $input) {
    id
    location
    magnitude
    date
  }
}

mutation DeleteEarthquake($id: ID!) {
  deleteEarthquake(id: $id) {
    id
  }
}
```
