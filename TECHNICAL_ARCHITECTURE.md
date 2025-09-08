# Technical Architecture Document

## AL GHANI POULTRY SERVICES - Broiler Sales Management System

## System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Web App   │  │  Mobile App │  │     Admin Panel         │ │
│  │  (Next.js)  │  │   (Future)  │  │   (Advanced Users)      │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Rate      │  │   CORS      │  │     Request             │ │
│  │  Limiting   │  │   Policy    │  │   Validation            │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Auth       │  │  Farm       │  │     Ledger              │ │
│  │  Service    │  │  Service    │  │     Service             │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Vehicle    │  │  Broker     │  │     Report              │ │
│  │  Service    │  │  Service    │  │     Service             │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Access Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Mongoose   │  │  Data       │  │     Query               │ │
│  │   Models    │  │  Validation │  │   Optimization          │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  MongoDB    │  │  Redis      │  │     File Storage        │ │
│  │  (Primary)  │  │  (Cache)    │  │     (Reports)           │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema Design

### 1. Users Collection

```typescript
interface User {
  _id: ObjectId;
  username: string; // Unique username for login
  email: string; // Unique email address
  passwordHash: string; // Bcrypt hashed password
  role: "admin" | "manager" | "viewer";
  permissions: Permission[]; // Granular permissions
  createdAt: Date;
  updatedAt: Date;
}

interface Permission {
  resource: "farms" | "ledgers" | "reports" | "users";
  actions: ("create" | "read" | "update" | "delete")[];
}
```

### 2. Farms Collection

```typescript
interface Farm {
  _id: ObjectId;
  farmCode: string; // e.g., "AL GHANI 3"
  farmName: string;
  location: {
    address: string;
    city: string;
    coordinates?: [number, number];
  };
  shedCount: number;
  supervisor: {
    name: string;
    contactNumber: string;
    email?: string;
  };
  incharge: string; // e.g., "IBRAR", "SHANI"
  status: "active" | "inactive" | "maintenance";
  notes?: string;
  createdBy: ObjectId; // User reference
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. Flocks Collection

```typescript
interface Flock {
  _id: ObjectId;
  flockCode: string; // e.g., "AL GHANI 3-FL-2024-001"
  farmId: ObjectId; // Farm reference
  startDate: Date;
  expectedEndDate: Date;
  actualEndDate?: Date;
  initialBirdCount: number;
  currentBirdCount: number;
  status: "active" | "catching" | "completed" | "cancelled";
  feedConsumption: number; // Total feed consumed in kg
  mortalityRate: number;
  notes?: string;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. Vehicles Collection

```typescript
interface Vehicle {
  _id: ObjectId;
  vehicleNumber: string;
  vehicleType: "truck" | "pickup" | "other";
  capacity: number; // Maximum bird capacity
  driver: {
    name: string;
    contactNumber: string;
    licenseNumber: string;
    isActive: boolean;
  };
  broker: {
    name: string;
    contactNumber: string;
    company?: string;
    commission?: number;
  };
  status: "available" | "assigned" | "in-transit" | "maintenance";
  currentAssignment?: {
    farmId: ObjectId;
    flockId: ObjectId;
    assignedAt: Date;
  };
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

### 5. Ledgers Collection

```typescript
interface Ledger {
  _id: ObjectId;
  serialNumber: string; // Auto-generated
  farmId: ObjectId;
  flockId: ObjectId;
  vehicleId: ObjectId;
  driverName: string;
  brokerName: string;
  weights: {
    emptyVehicle: number; // kg
    loadedVehicle: number; // kg
    netWeight: number; // kg (calculated)
  };
  birdCount: {
    totalBirds: number;
    crates: number;
    birdsPerCrate: number;
  };
  transactionDate: Date;
  status: "draft" | "completed" | "verified" | "cancelled";
  notes?: string;
  verificationData?: {
    verifiedBy: ObjectId;
    verifiedAt: Date;
    verificationNotes?: string;
  };
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

### 6. Brokers Collection

```typescript
interface Broker {
  _id: ObjectId;
  brokerCode: string;
  name: string;
  contactNumber: string;
  email?: string;
  company?: string;
  address?: string;
  commissionRate: number; // Percentage
  paymentTerms: string;
  isActive: boolean;
  notes?: string;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints Structure

### Authentication Endpoints

```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/change-password
```

### User Management Endpoints

```
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
GET    /api/users/profile
PUT    /api/users/profile
```

### Farm Management Endpoints

```
GET    /api/farms
POST   /api/farms
GET    /api/farms/:id
PUT    /api/farms/:id
DELETE /api/farms/:id
GET    /api/farms/:id/flocks
GET    /api/farms/active
```

### Flock Management Endpoints

```
GET    /api/flocks
POST   /api/flocks
GET    /api/flocks/:id
PUT    /api/flocks/:id
DELETE /api/flocks/:id
POST   /api/flocks/:id/start-catching
POST   /api/flocks/:id/complete
GET    /api/flocks/:id/ledgers
```

### Vehicle Management Endpoints

```
GET    /api/vehicles
POST   /api/vehicles
GET    /api/vehicles/:id
PUT    /api/vehicles/:id
DELETE /api/vehicles/:id
POST   /api/vehicles/:id/assign
POST   /api/vehicles/:id/release
GET    /api/vehicles/available
```

### Ledger Management Endpoints

```
GET    /api/ledgers
POST   /api/ledgers
GET    /api/ledgers/:id
PUT    /api/ledgers/:id
DELETE /api/ledgers/:id
POST   /api/ledgers/:id/verify
GET    /api/ledgers/farm/:farmId
GET    /api/ledgers/flock/:flockId
```

### Reporting Endpoints

```
GET    /api/reports/fcr/:flockId
GET    /api/reports/farm-summary/:farmId
GET    /api/reports/vehicle-summary/:vehicleId
GET    /api/reports/broker-summary/:brokerId
GET    /api/reports/export/:type
```

## Frontend Architecture

### Component Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/             # Reusable components
│   ├── ui/                # Shadcn UI components
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

### State Management Strategy

#### Zustand Stores

```typescript
// UI State Store
interface UIStore {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  notifications: Notification[];
  modals: ModalState[];

  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark") => void;
  addNotification: (notification: Notification) => void;
  openModal: (modal: ModalState) => void;
}

// Auth Store
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
```

#### TanStack Query Configuration

```typescript
// Query Client Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query Keys
export const queryKeys = {
  farms: ["farms"] as const,
  farm: (id: string) => ["farm", id] as const,
  flocks: ["flocks"] as const,
  flock: (id: string) => ["flock", id] as const,
  ledgers: ["ledgers"] as const,
  ledger: (id: string) => ["ledger", id] as const,
  vehicles: ["vehicles"] as const,
  vehicle: (id: string) => ["vehicle", id] as const,
};
```

## Security Implementation

### Authentication Flow

1. **Login Process**

   - User submits credentials
   - Server validates and returns JWT token
   - Token stored in secure HTTP-only cookie
   - Refresh token mechanism for extended sessions

2. **Authorization Middleware**

   - JWT token validation on each request
   - Role-based access control (RBAC)
   - Resource-level permissions
   - Rate limiting and brute force protection

3. **Data Protection**
   - Input sanitization and validation
   - SQL injection prevention
   - XSS protection
   - CSRF token validation

### Security Headers

```typescript
// Security middleware configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);
```

## Performance Optimization

### Database Optimization

1. **Indexing Strategy**

   - Compound indexes for common queries
   - Text indexes for search operations
   - Geospatial indexes for location-based queries

2. **Query Optimization**

   - Aggregation pipeline optimization
   - Projection to limit returned fields
   - Pagination for large datasets

3. **Caching Strategy**
   - Redis for session storage
   - In-memory caching for frequently accessed data
   - CDN for static assets

### Frontend Optimization

1. **Code Splitting**

   - Route-based code splitting
   - Component lazy loading
   - Dynamic imports for heavy components

2. **Data Fetching**

   - Optimistic updates
   - Background refetching
   - Infinite scrolling for large lists

3. **Bundle Optimization**
   - Tree shaking
   - Minification and compression
   - Image optimization

## Monitoring and Logging

### Application Monitoring

```typescript
// Logging configuration
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Performance monitoring
app.use(morgan("combined"));
app.use(compression());
```

### Error Handling

```typescript
// Global error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    user: req.user?.id,
  });

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});
```

## Deployment Architecture

### Environment Configuration

```typescript
// Environment variables
interface Environment {
  NODE_ENV: "development" | "production" | "test";
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  REDIS_URL: string;
  CORS_ORIGIN: string;
  RATE_LIMIT_WINDOW: number;
  RATE_LIMIT_MAX: number;
}

// Configuration validation
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.string().transform(Number),
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string(),
  REDIS_URL: z.string().url(),
  CORS_ORIGIN: z.string(),
  RATE_LIMIT_WINDOW: z.string().transform(Number),
  RATE_LIMIT_MAX: z.string().transform(Number),
});
```

### Production Considerations

1. **Load Balancing**

   - Multiple application instances
   - Health checks and auto-scaling
   - Database connection pooling

2. **Backup Strategy**

   - Automated database backups
   - File system backups
   - Disaster recovery procedures

3. **Monitoring and Alerting**
   - Application performance monitoring
   - Error rate tracking
   - Resource utilization monitoring
   - Automated alerting for critical issues

## Testing Strategy

### Testing Pyramid

```
        /\
       /  \     E2E Tests (Few)
      /____\
     /      \   Integration Tests (Some)
    /________\
   /          \  Unit Tests (Many)
  /____________\
```

### Test Types

1. **Unit Tests**

   - Individual function testing
   - Component testing with React Testing Library
   - Utility function testing

2. **Integration Tests**

   - API endpoint testing
   - Database operation testing
   - Service layer testing

3. **E2E Tests**
   - User workflow testing
   - Critical path testing
   - Cross-browser compatibility

### Testing Tools

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing
- **Supertest** - API testing
- **Playwright** - E2E testing
- **MSW** - API mocking

## Future Scalability Considerations

### Horizontal Scaling

1. **Microservices Architecture**

   - Service decomposition
   - API gateway implementation
   - Service discovery and load balancing

2. **Database Scaling**

   - Read replicas
   - Sharding strategies
   - Caching layers

3. **Infrastructure Scaling**
   - Container orchestration (Kubernetes)
   - Auto-scaling policies
   - Multi-region deployment

### Feature Extensibility

1. **Plugin Architecture**

   - Modular feature development
   - Third-party integrations
   - Custom business logic extensions

2. **API Versioning**

   - Backward compatibility
   - Feature flags
   - Gradual rollout strategies

3. **Data Migration**
   - Schema evolution
   - Data transformation pipelines
   - Rollback procedures

---

**Document Status**: Draft  
**Last Updated**: [Current Date]  
**Next Review**: [Next Review Date]  
**Technical Lead**: [Technical Lead Name]
