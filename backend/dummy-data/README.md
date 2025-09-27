# Dummy Data APIs

This directory contains dummy data generation APIs and JSON files for the Al Ghani Farm backend system.

## Available APIs

### 1. Farms

- **Endpoint**: `POST /api/v1/farms/dummy`
- **Query Parameters**: `count` (optional, default: 10, max: 100)
- **Example**: `POST /api/v1/farms/dummy?count=20`

### 2. Buyers

- **Endpoint**: `POST /api/v1/buyers/dummy`
- **Query Parameters**: `count` (optional, default: 10, max: 100)
- **Example**: `POST /api/v1/buyers/dummy?count=15`

### 3. Sheds

- **Endpoint**: `POST /api/v1/sheds/dummy`
- **Query Parameters**: `count` (optional, default: 10, max: 100)
- **Requirements**: Farms must exist first
- **Example**: `POST /api/v1/sheds/dummy?count=25`

### 4. Flocks

- **Endpoint**: `POST /api/v1/flocks/dummy`
- **Query Parameters**: `count` (optional, default: 10, max: 50)
- **Requirements**: Farms and Sheds must exist first
- **Example**: `POST /api/v1/flocks/dummy?count=20`

### 5. Ledgers

- **Endpoint**: `POST /api/v1/ledgers/dummy`
- **Query Parameters**: `count` (optional, default: 10, max: 50)
- **Requirements**: Farms, Flocks, Sheds, and Buyers must exist first
- **Example**: `POST /api/v1/ledgers/dummy?count=30`

### 6. Users

- **Endpoint**: `POST /api/v1/users/dummy`
- **Query Parameters**: `count` (optional, default: 10, max: 50)
- **Example**: `POST /api/v1/users/dummy?count=15`

## JSON Files

This directory also contains JSON files with sample data for each module:

- `farms.json` - Sample farm data
- `buyers.json` - Sample buyer data
- `sheds.json` - Sample shed data (requires farm IDs)
- `flocks.json` - Sample flock data (requires farm and shed IDs)
- `ledgers.json` - Sample ledger data (requires all entity IDs)
- `users.json` - Sample user data

## Usage Order

For best results, create dummy data in this order:

1. **Farms** - Create farms first as they are the base entity
2. **Buyers** - Independent entity, can be created anytime
3. **Sheds** - Requires farms to exist
4. **Flocks** - Requires farms and sheds to exist
5. **Ledgers** - Requires all entities (farms, flocks, sheds, buyers) to exist
6. **Users** - Independent entity, can be created anytime

## Authentication

All dummy data creation endpoints require authentication and admin/manager roles.

## Example Usage

```bash
# Create 20 farms
curl -X POST "http://localhost:8080/api/v1/farms/dummy?count=20" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create 15 buyers
curl -X POST "http://localhost:8080/api/v1/buyers/dummy?count=15" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create 25 sheds (after farms exist)
curl -X POST "http://localhost:8080/api/v1/sheds/dummy?count=25" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create 20 flocks (after farms and sheds exist)
curl -X POST "http://localhost:8080/api/v1/flocks/dummy?count=20" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create 30 ledgers (after all entities exist)
curl -X POST "http://localhost:8080/api/v1/ledgers/dummy?count=30" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create 15 users
curl -X POST "http://localhost:8080/api/v1/users/dummy?count=15" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Notes

- All dummy data is generated with realistic Pakistani names and phone numbers
- Vehicle numbers follow Pakistani format
- **Dates are generated dynamically between 2020-2025 for comprehensive testing of date filters**
- Weight calculations follow business logic (gross = empty + net)
- Amount calculations follow business logic (total = net weight × rate)
- User passwords are set to "password123" for all dummy users
- All data respects the validation rules defined in the schemas
- Date ranges allow testing of yearly, monthly, weekly, and daily filters across all modules
