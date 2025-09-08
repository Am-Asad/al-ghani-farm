# Frontend - AL GHANI POULTRY SERVICES

This is the frontend application for the AL GHANI POULTRY SERVICES broiler sales management system.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (client state), TanStack Query (server state)
- **UI Components**: Radix UI primitives
- **Testing**: Jest, React Testing Library, Playwright

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/             # Reusable components
│   ├── ui/                # Base UI components
│   ├── forms/             # Form components
│   ├── tables/            # Data table components
│   ├── charts/            # Chart components
│   └── layout/            # Layout components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
├── stores/                 # Zustand stores
├── types/                  # TypeScript type definitions
└── utils/                  # Helper functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME="AL GHANI POULTRY SERVICES"
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## State Management

### Zustand Stores

- **Auth Store** (`stores/auth-store.ts`) - User authentication and session management
- **UI Store** (`stores/ui-store.ts`) - UI state like sidebar, theme, notifications

### TanStack Query

- **Query Client** (`lib/query-client.ts`) - Server state management with caching
- **Query Keys** - Organized query key structure for all API endpoints

## API Integration

### API Utilities

- **API Client** (`utils/api.ts`) - HTTP client with authentication and error handling
- **Base URL** - Configurable via `NEXT_PUBLIC_API_URL` environment variable

### Authentication

- JWT token-based authentication
- Automatic token inclusion in API requests
- Token persistence in localStorage

## Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow functional programming approach
- Implement proper error handling

### Component Structure

- Use functional components with hooks
- Implement proper prop typing
- Add error boundaries where appropriate
- Follow accessibility best practices

## Build and Deployment

### Development

```bash
npm run dev
```

Access the application at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run start
```

### Docker (Optional)

```bash
docker build -t al-ghani-frontend .
docker run -p 3000:3000 al-ghani-frontend
```

## Troubleshooting

### Common Issues

1. **TypeScript Errors**

   - Ensure all imports use correct paths
   - Check type definitions in `src/types/`

2. **API Connection Issues**

   - Verify `NEXT_PUBLIC_API_URL` is set correctly
   - Check backend server is running

### Getting Help

- Check the main project README for architecture details
- Ensure all dependencies are properly installed
