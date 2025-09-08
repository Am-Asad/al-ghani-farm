# AL GHANI POULTRY SERVICES - Broiler Sales Management System

## Project Overview

A comprehensive web application for managing broiler sales operations, replacing manual ledger systems with digital tracking for improved efficiency and FCR calculations.

## Business Requirements Analysis

### Core Entities

1. **Farms/Units** - Individual poultry farms (e.g., AL GHANI 3, ABDUL GHANI 1, AL WASSY 1)
2. **Sheds/Houses** - Physical structures within each farm (typically 2-4 per farm)
3. **Flocks** - Groups of birds raised together (multiple per farm per year)
4. **Vehicles** - Transport units for market-ready birds
5. **Ledgers** - Individual transaction records for each vehicle load
6. **Users** - Company staff with different access levels

### Key Workflows

1. **Catching Phase Management** - Tracking birds from farm to market
2. **Ledger Creation** - Recording each vehicle's load details
3. **FCR Calculation** - Compiling total weights for feed conversion ratio
4. **Multi-Flock Tracking** - Managing multiple bird groups per farm annually

### Data Requirements

- **Vehicle Ledger Fields**: Serial number, driver name, broker name, empty weight, loaded weight, net weight, bird count (crates)
- **Farm Management**: Farm names, shed counts, supervisor contacts
- **User Management**: Role-based access control (internal staff vs. view-only users)

## Project Structure

```
al-ghani-farm/
├── backend/                 # Express.js backend API (JavaScript)
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── app.js          # Express app setup
│   ├── tests/              # Backend tests
│   ├── package.json        # Backend dependencies
│   └── .env                # Backend environment variables
├── frontend/                # Next.js frontend application (TypeScript)
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── stores/         # Zustand stores
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── tests/              # Frontend tests
│   ├── package.json        # Frontend dependencies
│   └── .env.local          # Frontend environment variables
└── README.md               # Project documentation
```

## Technology Stack

### Backend

- **Runtime**: Node.js with Express.js
- **Language**: JavaScript (ES6+)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with simple role management
- **Validation**: Zod schemas
- **Testing**: Jest, Supertest

### Frontend

- **Framework**: Next.js 15 (App Router), React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Shadcn UI, Radix UI
- **State Management**: Zustand (UI state), TanStack Query (server state)
- **Forms**: FormData API
- **Testing**: Jest, React Testing Library, Playwright

## Authentication & Permissions

### User Roles

1. **Admin** - Full access to all features (create, read, update, delete)
2. **Viewer** - Read-only access to all data

### Simplified Permission System

- No complex granular permissions
- Role-based access control at the application level
- JWT tokens for session management

## Development Iterations

### Phase 1: Foundation & Authentication (Week 1-2)

**Goal**: Basic system setup with user management and core infrastructure

#### Backend TODO:

- [ ] Project initialization with Express.js and JavaScript (ES6+)
- [ ] Database setup and connection (MongoDB + Mongoose)
- [ ] User authentication system (JWT + simple role management)
- [ ] Basic user management (CRUD operations)
- [ ] Environment configuration and security setup

#### Frontend TODO:

- [ ] Project initialization with Next.js 15 and TypeScript
- [ ] Basic layout and navigation structure
- [ ] Authentication pages (login, logout)
- [ ] Protected route middleware

#### Testing TODO:

- [ ] Backend unit tests for user authentication
- [ ] Backend integration tests for user endpoints
- [ ] Frontend unit tests for authentication components
- [ ] Frontend integration tests for login flow
- [ ] End-to-end tests for complete authentication workflow

#### Deliverables:

- Working authentication system with two roles (Admin, Viewer)
- Basic project structure and routing
- Database connection and basic models
- Complete test coverage for authentication functionality

### Phase 2: Core Data Management (Week 3-4)

**Goal**: Implement farm and flock management systems

#### Backend TODO:

- [ ] Farm management CRUD operations
- [ ] Flock management (create, track, close)
- [ ] Supervisor contact management
- [ ] Basic data validation with Zod

#### Frontend TODO:

- [ ] Farm management interface
- [ ] Flock lifecycle management interface
- [ ] Admin dashboard for data management
- [ ] Data tables and forms

#### Testing TODO:

- [ ] Backend unit tests for farm and flock operations
- [ ] Backend integration tests for data management endpoints
- [ ] Frontend unit tests for farm and flock components
- [ ] Frontend integration tests for CRUD operations
- [ ] End-to-end tests for complete farm management workflow

#### Deliverables:

- Complete farm management system
- Flock lifecycle management
- Supervisor contact database
- Admin data management interface
- Complete test coverage for data management functionality

### Phase 3: Vehicle & Broker Management (Week 5-6)

**Goal**: Implement vehicle tracking and broker management

#### Backend TODO:

- [ ] Vehicle registration and management
- [ ] Driver information management
- [ ] Broker database and contact management
- [ ] Vehicle-farm assignment system

#### Frontend TODO:

- [ ] Vehicle management interface
- [ ] Driver and broker management forms
- [ ] Assignment and tracking interface

#### Testing TODO:

- [ ] Backend unit tests for vehicle and broker operations
- [ ] Backend integration tests for assignment endpoints
- [ ] Frontend unit tests for vehicle and broker components
- [ ] Frontend integration tests for assignment workflow
- [ ] End-to-end tests for complete vehicle management workflow

#### Deliverables:

- Vehicle and driver management system
- Broker contact database
- Assignment and tracking capabilities
- Complete test coverage for vehicle management functionality

### Phase 4: Ledger System (Week 7-8)

**Goal**: Core ledger creation and management functionality

#### Backend TODO:

- [ ] Ledger creation with all required fields
- [ ] Serial number generation and management
- [ ] Weight calculation automation
- [ ] Data validation and error handling

#### Frontend TODO:

- [ ] Ledger creation form
- [ ] Ledger management interface
- [ ] Weight calculation display
- [ ] Status tracking interface

#### Testing TODO:

- [ ] Backend unit tests for ledger operations
- [ ] Backend integration tests for ledger endpoints
- [ ] Frontend unit tests for ledger components
- [ ] Frontend integration tests for ledger creation workflow
- [ ] End-to-end tests for complete ledger management workflow

#### Deliverables:

- Complete ledger creation system
- Automated calculations and validations
- Ledger status management
- Data integrity checks
- Complete test coverage for ledger functionality

### Phase 5: Catching Phase Management (Week 9-10)

**Goal**: Implement the complete catching phase workflow

#### Backend TODO:

- [ ] Farm-to-vehicle assignment system
- [ ] Catching phase status tracking
- [ ] Progress monitoring
- [ ] Vehicle queue management

#### Frontend TODO:

- [ ] Catching phase dashboard
- [ ] Vehicle assignment interface
- [ ] Progress monitoring display
- [ ] Queue management interface

#### Testing TODO:

- [ ] Backend unit tests for catching phase operations
- [ ] Backend integration tests for assignment endpoints
- [ ] Frontend unit tests for catching phase components
- [ ] Frontend integration tests for assignment workflow
- [ ] End-to-end tests for complete catching phase workflow

#### Deliverables:

- End-to-end catching phase management
- Real-time progress tracking
- Vehicle queue and assignment system
- Complete test coverage for catching phase functionality

### Phase 6: Reporting & FCR Calculation (Week 11-12)

**Goal**: Implement reporting and FCR calculation functionality

#### Backend TODO:

- [ ] Ledger compilation and aggregation
- [ ] Total weight calculations per flock
- [ ] FCR calculation system
- [ ] Report generation

#### Frontend TODO:

- [ ] FCR calculation display
- [ ] Report generation interface
- [ ] Data visualization components
- [ ] Export functionality

#### Testing TODO:

- [ ] Backend unit tests for calculation logic
- [ ] Backend integration tests for reporting endpoints
- [ ] Frontend unit tests for reporting components
- [ ] Frontend integration tests for report generation
- [ ] End-to-end tests for complete reporting workflow

#### Deliverables:

- Automated FCR calculation system
- Comprehensive reporting capabilities
- Data analysis and visualization
- Export functionality
- Complete test coverage for reporting functionality

### Phase 7: Integration & Bug Fixes (Week 13-14)

**Goal**: System integration and bug resolution

#### TODO:

- [ ] End-to-end system testing
- [ ] Bug identification and fixes
- [ ] Performance testing and basic optimization
- [ ] User acceptance testing
- [ ] Documentation updates

#### Testing TODO:

- [ ] Complete system integration tests
- [ ] Performance testing under load
- [ ] Cross-browser compatibility testing
- [ ] Mobile responsiveness testing
- [ ] Security testing for authentication and authorization

#### Deliverables:

- Fully integrated and tested system
- Bug-free application functionality
- Performance baseline established
- Complete user documentation

### Phase 8: Deployment & Go-Live (Week 15-16)

**Goal**: Production deployment and user training

#### TODO:

- [ ] Production environment setup
- [ ] Final testing in production environment
- [ ] User training and documentation
- [ ] Go-live support and monitoring
- [ ] Post-deployment bug fixes

#### Testing TODO:

- [ ] Production environment testing
- [ ] Load testing in production
- [ ] User acceptance testing in production
- [ ] Monitoring and alerting setup

#### Deliverables:

- Production-ready application
- Complete user documentation and training materials
- Production monitoring setup
- Go-live support system

## Security Considerations

### Access Control

- Simple role-based access (Admin: full access, Viewer: read-only)
- JWT token-based authentication
- Session management and timeout
- Protected routes for sensitive operations

### Data Protection

- Input validation and sanitization with Zod
- MongoDB injection prevention
- XSS protection
- Basic data encryption for sensitive information

### Audit & Compliance

- User login/logout logging
- Basic data access tracking
- Change history for critical operations

## Performance Requirements

### Response Times

- Page load: < 3 seconds
- API responses: < 1000ms
- Search operations: < 3 seconds
- Report generation: < 15 seconds

### Core Functionality Focus

- Stable and reliable application performance
- Efficient database queries with proper indexing
- Responsive user interface
- Basic error handling and user feedback

### Technical Metrics

- System uptime: > 99.5%
- Response time compliance: > 95%
- Data accuracy: > 99.9%
- User adoption rate: > 90%

### Business Metrics

- Reduction in manual ledger errors
- Faster FCR calculation time
- Improved data accessibility
- Enhanced operational efficiency

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 6+
- Git
- Modern web browser

### Development Setup

```bash
# Clone the repository
git clone [repository-url]
cd al-ghani-farm

# Backend Setup
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend Setup (in new terminal)
cd ../frontend
npm install
cp .env.example .env.local
npm run dev
```

### Environment Variables

#### Backend (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/al-ghani-farm

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
```

#### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME="AL GHANI POULTRY SERVICES"
```

### Package.json Scripts

#### Backend Scripts

```json
{
  "scripts": {
    "dev": "nodemon src/app.js",
    "start": "node src/app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  }
}
```

#### Frontend Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test"
  }
}
```

## Contributing

### Development Guidelines

- **Backend**: Use JavaScript (ES6+) with modern syntax and best practices
- **Frontend**: Follow TypeScript strict mode
- Use functional programming approach
- Implement proper error handling
- **Write comprehensive tests for ALL functionality**
- Follow Git commit conventions
- Test each feature thoroughly before moving to the next

### Testing Requirements

- **Unit tests** for all backend functions and frontend components
- **Integration tests** for all API endpoints
- **End-to-end tests** for complete user workflows
- **Test coverage** must be > 90% for all new code
- **No feature** can be considered complete without passing tests

### Code Review Process

- All changes require peer review
- **All tests must pass** before code review
- **Test coverage reports** must be included in PRs
- Code quality checks enforced
- Documentation updates required

## Support & Maintenance

### Support Channels

- Technical issues: [contact-email]
- User training: [training-email]
- Emergency support: [emergency-contact]

### Maintenance Schedule

- Regular security updates
- Performance monitoring
- Database optimization
- User feedback collection

---

**Project Status**: Planning Phase  
**Last Updated**: [Current Date]  
**Next Review**: [Next Review Date]
