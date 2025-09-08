# Database Schema Documentation

## AL GHANI POULTRY SERVICES - Broiler Sales Management System

## Database Overview

- **Database Name**: `al-ghani-farm`
- **Database Type**: MongoDB (NoSQL)
- **ODM**: Mongoose
- **Connection**: MongoDB Atlas (Production) / Local MongoDB (Development)

## Collections Schema

### 1. Users Collection

**Collection Name**: `users`

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
  resource: "farms" | "ledgers" | "reports" | "users" | "vehicles" | "brokers";
  actions: ("create" | "read" | "update" | "delete")[];
}
```

**Indexes**:

```javascript
// Unique indexes
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });

// Performance indexes
db.users.createIndex({ role: 1 });
db.users.createIndex({ isActive: 1 });
db.users.createIndex({ createdAt: -1 });
```

**Validation Rules**:

```javascript
{
  validator: {
    $jsonSchema: {
      required: ["username", "email", "passwordHash", "role", "firstName", "lastName"],
      properties: {
        username: { type: "string", minLength: 3, maxLength: 50 },
        email: { type: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
        role: { enum: ["admin", "manager", "viewer"] },
        phoneNumber: { type: "string", pattern: "^[0-9]{11}$" }
      }
    }
  }
}
```

### 2. Farms Collection

**Collection Name**: `farms`

```typescript
interface Farm {
  _id: ObjectId;
  farmCode: string; // Unique identifier (e.g., "AL GHANI 3")
  farmName: string; // Display name
  location: {
    address: string;
    city: string;
    district: string;
    coordinates?: [number, number]; // [longitude, latitude]
    postalCode?: string;
  };
  shedCount: number; // Number of sheds/houses
  supervisor: {
    name: string;
    contactNumber: string;
    email?: string;
    address?: string;
  };
  incharge: string; // Manager in charge (e.g., "IBRAR", "SHANI")
  status: "active" | "inactive" | "maintenance";
  capacity: {
    totalBirds: number; // Maximum bird capacity
    birdsPerShed: number; // Birds per individual shed
  };
  facilities: string[]; // Available facilities
  notes?: string;
  isActive: boolean;
  createdBy: ObjectId; // User reference
  createdAt: Date;
  updatedAt: Date;
  updatedBy: ObjectId; // Last user to modify
}
```

**Indexes**:

```javascript
// Unique indexes
db.farms.createIndex({ farmCode: 1 }, { unique: true });

// Performance indexes
db.farms.createIndex({ status: 1 });
db.farms.createIndex({ incharge: 1 });
db.farms.createIndex({ isActive: 1 });
db.farms.createIndex({ "location.city": 1 });
db.farms.createIndex({ createdAt: -1 });

// Geospatial index
db.farms.createIndex({ "location.coordinates": "2dsphere" });
```

**Validation Rules**:

```javascript
{
  validator: {
    $jsonSchema: {
      required: ["farmCode", "farmName", "location", "shedCount", "supervisor", "incharge"],
      properties: {
        farmCode: { type: "string", minLength: 2, maxLength: 20 },
        shedCount: { type: "number", minimum: 1, maximum: 20 },
        status: { enum: ["active", "inactive", "maintenance"] }
      }
    }
  }
}
```

### 3. Flocks Collection

**Collection Name**: `flocks`

```typescript
interface Flock {
  _id: ObjectId;
  flockCode: string; // Auto-generated (e.g., "AL GHANI 3-FL-2024-001")
  farmId: ObjectId; // Reference to farm
  startDate: Date; // When birds were placed
  expectedEndDate: Date; // Expected harvest date
  actualEndDate?: Date; // Actual harvest completion date
  initialBirdCount: number; // Birds placed initially
  currentBirdCount: number; // Current bird count
  mortalityCount: number; // Total birds lost
  mortalityRate: number; // Calculated mortality percentage
  feedConsumption: number; // Total feed consumed (kg)
  feedCost: number; // Total feed cost
  status: "active" | "catching" | "completed" | "cancelled";
  catchingPhase: {
    startDate?: Date;
    endDate?: Date;
    totalVehicles: number;
    totalBirdsCaught: number;
    totalWeight: number;
  };
  performance: {
    averageWeight: number; // Average bird weight at harvest
    feedConversionRatio?: number; // Calculated FCR
    dailyMortality: number[]; // Daily mortality tracking
  };
  notes?: string;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: ObjectId;
}
```

**Indexes**:

```javascript
// Performance indexes
db.flocks.createIndex({ farmId: 1 });
db.flocks.createIndex({ status: 1 });
db.flocks.createIndex({ startDate: -1 });
db.flocks.createIndex({ expectedEndDate: 1 });
db.flocks.createIndex({ flockCode: 1 });

// Compound indexes
db.flocks.createIndex({ farmId: 1, status: 1 });
db.flocks.createIndex({ farmId: 1, startDate: -1 });
```

**Validation Rules**:

```javascript
{
  validator: {
    $jsonSchema: {
      required: ["flockCode", "farmId", "startDate", "expectedEndDate", "initialBirdCount"],
      properties: {
        initialBirdCount: { type: "number", minimum: 1 },
        status: { enum: ["active", "catching", "completed", "cancelled"] }
      }
    }
  }
}
```

### 4. Vehicles Collection

**Collection Name**: `vehicles`

```typescript
interface Vehicle {
  _id: ObjectId;
  vehicleNumber: string; // License plate number
  vehicleType: "truck" | "pickup" | "other";
  capacity: {
    maxBirds: number; // Maximum bird capacity
    maxWeight: number; // Maximum weight capacity (kg)
    crateCount: number; // Number of crates it can carry
  };
  specifications: {
    make: string;
    model: string;
    year: number;
    color: string;
  };
  driver: {
    name: string;
    contactNumber: string;
    licenseNumber: string;
    licenseExpiry: Date;
    isActive: boolean;
    emergencyContact?: string;
  };
  broker: {
    name: string;
    contactNumber: string;
    company?: string;
    commission?: number; // Commission percentage
    paymentTerms: string;
  };
  status:
    | "available"
    | "assigned"
    | "in-transit"
    | "maintenance"
    | "out-of-service";
  currentAssignment?: {
    farmId: ObjectId;
    flockId: ObjectId;
    assignedAt: Date;
    expectedReturn: Date;
    assignedBy: ObjectId;
  };
  maintenance: {
    lastService: Date;
    nextService: Date;
    serviceHistory: MaintenanceRecord[];
  };
  insurance: {
    policyNumber: string;
    expiryDate: Date;
    company: string;
  };
  isActive: boolean;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: ObjectId;
}

interface MaintenanceRecord {
  date: Date;
  description: string;
  cost: number;
  serviceProvider: string;
  nextServiceDate: Date;
}
```

**Indexes**:

```javascript
// Unique indexes
db.vehicles.createIndex({ vehicleNumber: 1 }, { unique: true });

// Performance indexes
db.vehicles.createIndex({ status: 1 });
db.vehicles.createIndex({ vehicleType: 1 });
db.vehicles.createIndex({ isActive: 1 });
db.vehicles.createIndex({ "driver.contactNumber": 1 });
db.vehicles.createIndex({ "broker.contactNumber": 1 });

// Compound indexes
db.vehicles.createIndex({ status: 1, isActive: 1 });
db.vehicles.createIndex({ vehicleType: 1, status: 1 });
```

### 5. Ledgers Collection

**Collection Name**: `ledgers`

```typescript
interface Ledger {
  _id: ObjectId;
  serialNumber: string; // Auto-generated sequential number
  farmId: ObjectId; // Reference to farm
  flockId: ObjectId; // Reference to flock
  vehicleId: ObjectId; // Reference to vehicle

  // Basic Information
  transactionDate: Date;
  transactionTime: string; // Time of transaction (HH:MM)

  // Personnel Information
  driverName: string;
  driverContact: string;
  brokerName: string;
  brokerContact: string;

  // Weight Information
  weights: {
    emptyVehicle: number; // Empty vehicle weight (kg)
    loadedVehicle: number; // Vehicle weight with birds (kg)
    netWeight: number; // Calculated net weight (kg)
    tareWeight: number; // Vehicle + crates weight (kg)
  };

  // Bird Information
  birdCount: {
    totalBirds: number;
    crates: number;
    birdsPerCrate: number;
    deadBirds: number; // Birds that died during transport
  };

  // Financial Information
  pricing: {
    pricePerKg: number;
    totalAmount: number;
    commission: number;
    netAmount: number;
  };

  // Status and Verification
  status: "draft" | "completed" | "verified" | "cancelled";
  verificationData?: {
    verifiedBy: ObjectId;
    verifiedAt: Date;
    verificationNotes?: string;
  };

  // Additional Information
  notes?: string;
  weatherConditions?: string;
  transportDistance?: number; // Distance in km

  // Audit Information
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: ObjectId;
}
```

**Indexes**:

```javascript
// Performance indexes
db.ledgers.createIndex({ serialNumber: 1 });
db.ledgers.createIndex({ farmId: 1 });
db.ledgers.createIndex({ flockId: 1 });
db.ledgers.createIndex({ vehicleId: 1 });
db.ledgers.createIndex({ transactionDate: -1 });
db.ledgers.createIndex({ status: 1 });
db.ledgers.createIndex({ driverName: 1 });
db.ledgers.createIndex({ brokerName: 1 });

// Compound indexes
db.ledgers.createIndex({ farmId: 1, transactionDate: -1 });
db.ledgers.createIndex({ flockId: 1, transactionDate: -1 });
db.ledgers.createIndex({ vehicleId: 1, transactionDate: -1 });
db.ledgers.createIndex({ status: 1, transactionDate: -1 });

// Text search index
db.ledgers.createIndex({
  driverName: "text",
  brokerName: "text",
  notes: "text",
});
```

**Validation Rules**:

```javascript
{
  validator: {
    $jsonSchema: {
      required: ["serialNumber", "farmId", "flockId", "vehicleId", "transactionDate"],
      properties: {
        weights: {
          required: ["emptyVehicle", "loadedVehicle", "netWeight"],
          properties: {
            emptyVehicle: { type: "number", minimum: 0 },
            loadedVehicle: { type: "number", minimum: 0 },
            netWeight: { type: "number", minimum: 0 }
          }
        },
        birdCount: {
          required: ["totalBirds", "crates"],
          properties: {
            totalBirds: { type: "number", minimum: 1 },
            crates: { type: "number", minimum: 1 }
          }
        }
      }
    }
  }
}
```

### 6. Brokers Collection

**Collection Name**: `brokers`

```typescript
interface Broker {
  _id: ObjectId;
  brokerCode: string; // Unique broker identifier
  name: string; // Broker's full name
  contactNumber: string; // Primary contact number
  email?: string; // Email address
  company?: string; // Company name
  address: {
    street: string;
    city: string;
    district: string;
    postalCode?: string;
  };
  businessDetails: {
    businessType: "individual" | "company" | "partnership";
    taxNumber?: string;
    registrationNumber?: string;
  };
  commission: {
    rate: number; // Commission percentage
    paymentTerms: string; // Payment terms (e.g., "Net 30")
    preferredPaymentMethod: string;
  };
  performance: {
    totalTransactions: number;
    totalVolume: number; // Total weight handled
    averageRating: number; // Performance rating
    lastTransactionDate?: Date;
  };
  status: "active" | "inactive" | "suspended";
  notes?: string;
  isActive: boolean;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: ObjectId;
}
```

**Indexes**:

```javascript
// Unique indexes
db.brokers.createIndex({ brokerCode: 1 }, { unique: true });
db.brokers.createIndex({ contactNumber: 1 }, { unique: true });

// Performance indexes
db.brokers.createIndex({ status: 1 });
db.brokers.createIndex({ isActive: 1 });
db.brokers.createIndex({ "businessDetails.businessType": 1 });
db.brokers.createIndex({ createdAt: -1 });

// Text search index
db.brokers.createIndex({
  name: "text",
  company: "text",
  "address.city": "text",
});
```

### 7. Audit Logs Collection

**Collection Name**: `audit_logs`

```typescript
interface AuditLog {
  _id: ObjectId;
  userId: ObjectId; // User who performed the action
  action: string; // Action performed (CREATE, UPDATE, DELETE, LOGIN, etc.)
  resource: string; // Resource affected (farms, ledgers, users, etc.)
  resourceId?: ObjectId; // ID of the affected resource
  details: {
    before?: any; // Data before change
    after?: any; // Data after change
    changes?: string[]; // List of changed fields
  };
  ipAddress: string; // IP address of the user
  userAgent: string; // User agent string
  timestamp: Date; // When the action occurred
  metadata?: {
    sessionId?: string;
    requestId?: string;
    additionalInfo?: any;
  };
}
```

**Indexes**:

```javascript
// Performance indexes
db.audit_logs.createIndex({ userId: 1 });
db.audit_logs.createIndex({ action: 1 });
db.audit_logs.createIndex({ resource: 1 });
db.audit_logs.createIndex({ timestamp: -1 });
db.audit_logs.createIndex({ ipAddress: 1 });

// Compound indexes
db.audit_logs.createIndex({ userId: 1, timestamp: -1 });
db.audit_logs.createIndex({ resource: 1, timestamp: -1 });
db.audit_logs.createIndex({ action: 1, timestamp: -1 });

// TTL index for automatic cleanup (keep logs for 2 years)
db.audit_logs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 63072000 });
```

## Database Relationships

### Referential Integrity

```typescript
// Farm -> Flocks (One-to-Many)
// A farm can have multiple flocks
db.flocks.createIndex({ farmId: 1 });

// Farm -> Ledgers (One-to-Many)
// A farm can have multiple ledgers
db.ledgers.createIndex({ farmId: 1 });

// Flock -> Ledgers (One-to-Many)
// A flock can have multiple ledgers
db.ledgers.createIndex({ flockId: 1 });

// Vehicle -> Ledgers (One-to-Many)
// A vehicle can have multiple ledgers
db.ledgers.createIndex({ vehicleId: 1 });

// User -> Created Records (One-to-Many)
// A user can create multiple records
db.farms.createIndex({ createdBy: 1 });
db.flocks.createIndex({ createdBy: 1 });
db.ledgers.createIndex({ createdBy: 1 });
```

### Data Consistency Rules

1. **Cascade Updates**: When a farm is deactivated, all associated flocks should be marked as inactive
2. **Referential Integrity**: Ledgers cannot exist without valid farm, flock, and vehicle references
3. **Status Synchronization**: Vehicle status should be updated when assigned to a catching operation
4. **Audit Trail**: All data modifications should be logged in the audit_logs collection

## Data Validation and Constraints

### Business Rules

1. **Farm Management**:

   - Farm codes must be unique across the system
   - Shed count must be between 1 and 20
   - Only active farms can have active flocks

2. **Flock Management**:

   - Flock start date cannot be in the future
   - Expected end date must be after start date
   - Current bird count cannot exceed initial bird count

3. **Vehicle Management**:

   - Vehicle numbers must be unique
   - Driver license must not be expired
   - Vehicle cannot be assigned to multiple farms simultaneously

4. **Ledger Management**:

   - Serial numbers must be sequential and unique
   - Net weight must equal loaded weight minus empty weight
   - Bird count must be positive
   - Transaction date cannot be in the future

5. **User Management**:
   - Usernames and emails must be unique
   - Passwords must meet security requirements
   - Users cannot delete themselves

## Performance Optimization

### Indexing Strategy

1. **Primary Indexes**: On `_id` field (automatically created)
2. **Unique Indexes**: On fields that must be unique
3. **Performance Indexes**: On frequently queried fields
4. **Compound Indexes**: On fields commonly used together
5. **Text Indexes**: For search functionality
6. **Geospatial Indexes**: For location-based queries

### Query Optimization

1. **Projection**: Only return required fields
2. **Pagination**: Use `skip()` and `limit()` for large datasets
3. **Aggregation**: Use MongoDB aggregation pipeline for complex calculations
4. **Caching**: Implement Redis caching for frequently accessed data

### Data Archiving

1. **TTL Indexes**: Automatically remove old audit logs
2. **Archive Collections**: Move old data to archive collections
3. **Data Partitioning**: Partition large collections by date

## Backup and Recovery

### Backup Strategy

1. **Daily Backups**: Automated daily backups to cloud storage
2. **Point-in-Time Recovery**: Enable oplog for point-in-time recovery
3. **Geographic Distribution**: Store backups in multiple locations
4. **Backup Verification**: Regular backup restoration tests

### Recovery Procedures

1. **Documentation**: Detailed recovery procedures documented
2. **Testing**: Regular disaster recovery drills
3. **Monitoring**: Continuous backup status monitoring
4. **Escalation**: Clear escalation procedures for backup failures

---

**Document Status**: Draft  
**Last Updated**: [Current Date]  
**Next Review**: [Next Review Date]  
**Database Administrator**: [DBA Name]
