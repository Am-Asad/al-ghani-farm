# Universal Reports API

## Overview

The Universal Reports API is the most powerful and flexible reporting endpoint in the system. It can generate comprehensive reports for any combination of entities, time durations, and custom filters. This single endpoint replaces the need for multiple specific report endpoints by accepting query parameters to customize the report generation.

## Endpoint

```
GET /api/reports/universal
```

### Export Endpoint

```
GET /api/reports/universal/export?format=csv|pdf|excel|json&<same query params as /universal>
```

Supported formats:

- `csv` → text/csv
- `pdf` → application/pdf
- `excel` (or `xlsx`) → application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
- `json` → application/json

The export endpoint accepts the exact same query parameters as the universal endpoint for filtering, grouping and pagination. The response is a downloadable file stream with a filename based on the computed report title and timestamp.

## Authentication

All requests require authentication via the `authHandler` middleware.

## Query Parameters

### Time Duration Parameters

| Parameter   | Type   | Default   | Description                                                                    |
| ----------- | ------ | --------- | ------------------------------------------------------------------------------ |
| `duration`  | string | `"daily"` | Time duration type: `daily`, `weekly`, `monthly`, `yearly`, `custom`, `period` |
| `date`      | string | -         | Specific date for daily/weekly/monthly/yearly reports (YYYY-MM-DD format)      |
| `startDate` | string | -         | Start date for custom range (YYYY-MM-DD format)                                |
| `endDate`   | string | -         | End date for custom range (YYYY-MM-DD format)                                  |
| `period`    | number | -         | Number of days to go back (for `period` duration)                              |

### Entity Filters (Comma-Separated Lists)

| Parameter  | Type   | Description                       |
| ---------- | ------ | --------------------------------- |
| `buyerIds` | string | Comma-separated list of buyer IDs |
| `farmIds`  | string | Comma-separated list of farm IDs  |
| `flockIds` | string | Comma-separated list of flock IDs |
| `shedIds`  | string | Comma-separated list of shed IDs  |

### Advanced Filters

| Parameter         | Type   | Description                                                                                                                          |
| ----------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `paymentStatus`   | string | Filter by payment status: `paid`, `partial`, `unpaid`                                                                                |
| `minAmount`       | number | Minimum total amount filter                                                                                                          |
| `maxAmount`       | number | Maximum total amount filter                                                                                                          |
| `minNetWeight`    | number | Minimum net weight filter                                                                                                            |
| `maxNetWeight`    | number | Maximum net weight filter                                                                                                            |
| `minBirds`        | number | Minimum bird count filter                                                                                                            |
| `maxBirds`        | number | Maximum bird count filter                                                                                                            |
| `minRate`         | number | Minimum rate filter                                                                                                                  |
| `maxRate`         | number | Maximum rate filter                                                                                                                  |
| `vehicleNumbers`  | string | Comma-separated list of vehicle numbers                                                                                              |
| `driverNames`     | string | Comma-separated list of driver names                                                                                                 |
| `accountantNames` | string | Comma-separated list of accountant names                                                                                             |
| `search`          | string | Search across vehicle numbers, driver names, contact numbers, accountant names, buyer names, farm names, flock names, and shed names |

### Sorting and Pagination Parameters

| Parameter   | Type   | Default  | Description                                                                                                                                          |
| ----------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sortBy`    | string | `"date"` | Field to sort by: `date`, `totalAmount`, `amountPaid`, `netWeight`, `numberOfBirds`, `rate`, `vehicleNumber`, `driverName`, `createdAt`, `updatedAt` |
| `sortOrder` | string | `"desc"` | Sort order: `asc` or `desc`                                                                                                                          |
| `page`      | number | `1`      | Page number for pagination                                                                                                                           |
| `limit`     | number | `10`     | Number of transactions to return (max: 1000)                                                                                                         |

### Aggregation Parameters

| Parameter        | Type   | Default  | Description                                                                                          |
| ---------------- | ------ | -------- | ---------------------------------------------------------------------------------------------------- |
| `includeDetails` | string | `"true"` | Include individual transactions in response (`"true"` = show transactions, `"false"` = summary only) |

## Duration Types

### 1. Daily Reports

```
GET /api/reports/universal?duration=daily&date=2024-01-15
```

- Requires: `date` parameter
- Returns: All transactions for the specified date

### 2. Weekly Reports

```
GET /api/reports/universal?duration=weekly&date=2024-01-15
```

- Optional: `date` parameter (defaults to current date)
- Returns: All transactions for the week containing the specified date

### 3. Monthly Reports

```
GET /api/reports/universal?duration=monthly&date=2024-01-15
```

- Optional: `date` parameter (defaults to current date)
- Returns: All transactions for the month containing the specified date

### 4. Yearly Reports

```
GET /api/reports/universal?duration=yearly&date=2024-01-15
```

- Optional: `date` parameter (defaults to current date)
- Returns: All transactions for the year containing the specified date

### 5. Custom Range Reports

```
GET /api/reports/universal?duration=custom&startDate=2024-01-01&endDate=2024-01-31
```

- Requires: `startDate` and `endDate` parameters
- Returns: All transactions within the specified date range

### 6. Period Reports

```
GET /api/reports/universal?duration=period&period=7
```

- Requires: `period` parameter
- Returns: All transactions for the last N days

## Use Cases and Examples

### 1. Buyer-Level Reports

#### Single Buyer Daily Report

```bash
curl -X GET "http://localhost:5000/api/reports/universal?buyerIds=64a1b2c3d4e5f6789012345&duration=daily&date=2024-01-15" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Export as CSV

```bash
curl -X GET "http://localhost:5000/api/reports/universal/export?format=csv&buyerIds=64a1b2c3d4e5f6789012345&duration=daily&date=2024-01-15" \
  -H "Authorization: Bearer YOUR_TOKEN" -OJ
```

#### Multiple Buyers Monthly Report

```bash
curl -X GET "http://localhost:5000/api/reports/universal?buyerIds=64a1b2c3d4e5f6789012345,64a1b2c3d4e5f6789012346&duration=monthly&date=2024-01-15" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Summary Only Report (No Individual Transactions)

```bash
curl -X GET "http://localhost:5000/api/reports/universal?buyerIds=64a1b2c3d4e5f6789012345&duration=monthly&includeDetails=false" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Buyer Report with Payment Status Filter

```bash
curl -X GET "http://localhost:5000/api/reports/universal?buyerIds=64a1b2c3d4e5f6789012345&duration=monthly&paymentStatus=unpaid&minAmount=1000" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Farm-Level Reports

#### Single Farm Custom Range Report

```bash
curl -X GET "http://localhost:5000/api/reports/universal?farmIds=64a1b2c3d4e5f6789012346&duration=custom&startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Export as Excel

```bash
curl -X GET "http://localhost:5000/api/reports/universal/export?format=excel&farmIds=64a1b2c3d4e5f6789012346&duration=custom&startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN" -OJ
```

#### Multiple Farms Report

```bash
curl -X GET "http://localhost:5000/api/reports/universal?farmIds=64a1b2c3d4e5f6789012346,64a1b2c3d4e5f6789012347&duration=monthly" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Flock-Level Reports

#### Single Flock Weekly Report

```bash
curl -X GET "http://localhost:5000/api/reports/universal?flockIds=64a1b2c3d4e5f6789012348&duration=weekly&date=2024-01-15" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Export as PDF

```bash
curl -X GET "http://localhost:5000/api/reports/universal/export?format=pdf&flockIds=64a1b2c3d4e5f6789012348&duration=weekly&date=2024-01-15" \
  -H "Authorization: Bearer YOUR_TOKEN" -OJ
```

#### Multiple Flocks with Weight Filter

```bash
curl -X GET "http://localhost:5000/api/reports/universal?flockIds=64a1b2c3d4e5f6789012348,64a1b2c3d4e5f6789012349&duration=monthly&minNetWeight=1000&maxNetWeight=5000" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Shed-Level Reports

#### Single Shed Daily Report

```bash
curl -X GET "http://localhost:5000/api/reports/universal?shedIds=64a1b2c3d4e5f6789012349&duration=daily&date=2024-01-15" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Export as JSON

```bash
curl -X GET "http://localhost:5000/api/reports/universal/export?format=json&shedIds=64a1b2c3d4e5f6789012349&duration=daily&date=2024-01-15" \
  -H "Authorization: Bearer YOUR_TOKEN" -OJ
```

#### Multiple Sheds from Different Farms

```bash
curl -X GET "http://localhost:5000/api/reports/universal?shedIds=64a1b2c3d4e5f6789012349,64a1b2c3d4e5f6789012350,64a1b2c3d4e5f6789012351&duration=custom&startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Complex Custom Filters

#### Cross-Entity Report with Multiple Filters

```bash
curl -X GET "http://localhost:5000/api/reports/universal?buyerIds=64a1b2c3d4e5f6789012345&farmIds=64a1b2c3d4e5f6789012346&duration=monthly&paymentStatus=partial&minAmount=5000&maxAmount=50000&vehicleNumbers=ABC-123,DEF-456" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Driver-Specific Report

```bash
curl -X GET "http://localhost:5000/api/reports/universal?driverNames=Ahmed Ali,Sara Khan&duration=period&period=30" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Accountant Performance Report

```bash
curl -X GET "http://localhost:5000/api/reports/universal?accountantNames=John Doe,Jane Smith&duration=monthly&sortBy=totalAmount&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Search Across All Fields

```bash
curl -X GET "http://localhost:5000/api/reports/universal?search=asad&duration=monthly" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Summary Reports (No Details)

#### Farm Summary Report

```bash
curl -X GET "http://localhost:5000/api/reports/universal?farmIds=64a1b2c3d4e5f6789012346&duration=yearly&includeDetails=false" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Buyer Summary with Pagination

```bash
curl -X GET "http://localhost:5000/api/reports/universal?buyerIds=64a1b2c3d4e5f6789012345&duration=monthly&limit=50&offset=0&sortBy=totalAmount&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Response Format

### Success Response - No Grouping (200 OK)

```json
{
  "status": "success",
  "message": "Universal report fetched successfully",
  "data": {
    "reportTitle": "Daily Report for 2024-01-15",
    "dateRange": {
      "from": "2024-01-15",
      "to": "2024-01-15"
    },
    "summary": {
      "totalTransactions": 10,
      "totalEmptyVehicleWeight": 5000.0,
      "totalGrossWeight": 17000.0,
      "totalNetWeight": 12000.0,
      "totalBirds": 600,
      "totalRate": 30000.0,
      "totalAmount": 180000.0,
      "totalPaid": 90000.0,
      "totalBalance": 90000.0,
      "averageRate": 3000.0,
      "averageNetWeight": 1200.0,
      "averageBirdsPerTransaction": 60.0
    },
    "transactions": [
      {
        "_id": "64a1b2c3d4e5f6789012347",
        "date": "2024-01-15T10:30:00.000Z",
        "vehicleNumber": "ABC-123",
        "driverName": "Ahmed Ali",
        "driverContact": "+92-300-7654321",
        "accountantName": "Sara Khan",
        "emptyVehicleWeight": 500.0,
        "grossWeight": 1700.0,
        "netWeight": 1200.0,
        "numberOfBirds": 60,
        "rate": 3000.0,
        "totalAmount": 18000.0,
        "amountPaid": 9000.0,
        "balance": 9000.0,
        "buyerInfo": {
          "_id": "64a1b2c3d4e5f6789012345",
          "name": "John Doe",
          "contactNumber": "+92-300-1234567",
          "address": "123 Main Street, Karachi"
        },
        "farmInfo": {
          "_id": "64a1b2c3d4e5f6789012346",
          "name": "Main Farm",
          "supervisor": "Ali Hassan"
        },
        "flockInfo": {
          "_id": "64a1b2c3d4e5f6789012348",
          "name": "Flock A",
          "status": "active"
        },
        "shedInfo": {
          "_id": "64a1b2c3d4e5f6789012349",
          "name": "Shed 1",
          "capacity": 1000
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "limit": 100,
      "offset": 0,
      "total": 10,
      "hasMore": false
    }
  }
}
```

### Success Response - With Grouping (200 OK)

```json
{
  "status": "success",
  "message": "Universal report fetched successfully",
  "data": {
    "reportTitle": "Monthly Report for January 2024",
    "grandTotal": {
      "totalTransactions": 25,
      "totalEmptyVehicleWeight": 12500.0,
      "totalGrossWeight": 42500.0,
      "totalNetWeight": 30000.0,
      "totalBirds": 1500,
      "totalRate": 75000.0,
      "totalAmount": 450000.0,
      "totalPaid": 225000.0,
      "totalBalance": 225000.0
    },
    "groupedResults": [
      {
        "groupId": "64a1b2c3d4e5f6789012346",
        "groupInfo": {
          "_id": "64a1b2c3d4e5f6789012346",
          "name": "Main Farm",
          "supervisor": "Ali Hassan"
        },
        "summary": {
          "totalTransactions": 15,
          "totalEmptyVehicleWeight": 7500.0,
          "totalGrossWeight": 25500.0,
          "totalNetWeight": 18000.0,
          "totalBirds": 900,
          "totalRate": 45000.0,
          "totalAmount": 270000.0,
          "totalPaid": 135000.0,
          "totalBalance": 135000.0,
          "averageRate": 3000.0,
          "averageNetWeight": 1200.0,
          "averageBirdsPerTransaction": 60.0,
          "dateRange": {
            "from": "2024-01-01",
            "to": "2024-01-31"
          }
        },
        "transactions": [
          {
            "_id": "64a1b2c3d4e5f6789012347",
            "date": "2024-01-15T10:30:00.000Z",
            "vehicleNumber": "ABC-123",
            "driverName": "Ahmed Ali",
            "driverContact": "+92-300-7654321",
            "accountantName": "Sara Khan",
            "emptyVehicleWeight": 500.0,
            "grossWeight": 1700.0,
            "netWeight": 1200.0,
            "numberOfBirds": 60,
            "rate": 3000.0,
            "totalAmount": 18000.0,
            "amountPaid": 9000.0,
            "balance": 9000.0,
            "buyerInfo": {
              "_id": "64a1b2c3d4e5f6789012345",
              "name": "John Doe",
              "contactNumber": "+92-300-1234567",
              "address": "123 Main Street, Karachi"
            },
            "farmInfo": {
              "_id": "64a1b2c3d4e5f6789012346",
              "name": "Main Farm",
              "supervisor": "Ali Hassan"
            },
            "flockInfo": {
              "_id": "64a1b2c3d4e5f6789012348",
              "name": "Flock A",
              "status": "active"
            },
            "shedInfo": {
              "_id": "64a1b2c3d4e5f6789012349",
              "name": "Shed 1",
              "capacity": 1000
            },
            "createdAt": "2024-01-15T10:30:00.000Z",
            "updatedAt": "2024-01-15T10:30:00.000Z"
          }
        ]
      }
    ]
  }
}
```

### No Data Response (200 OK)

```json
{
  "status": "success",
  "message": "Universal report fetched successfully",
  "data": {
    "reportTitle": "Daily Report for 2024-01-15",
    "grandTotal": {
      "totalTransactions": 0,
      "totalEmptyVehicleWeight": 0,
      "totalGrossWeight": 0,
      "totalNetWeight": 0,
      "totalBirds": 0,
      "totalRate": 0,
      "totalAmount": 0,
      "totalPaid": 0,
      "totalBalance": 0,
      "averageRate": 0,
      "averageNetWeight": 0,
      "averageBirdsPerTransaction": 0
    },
    "groupedResults": [],
    "pagination": {
      "limit": 100,
      "offset": 0,
      "total": 0,
      "hasMore": false
    }
  }
}
```

## Error Responses

### 400 Bad Request - Missing Date

```json
{
  "status": "error",
  "message": "Date is required for daily reports",
  "errorCode": "MISSING_DATE",
  "isOperational": true
}
```

### 400 Bad Request - Invalid Duration

```json
{
  "status": "error",
  "message": "Invalid duration. Supported: daily, weekly, monthly, yearly, custom, period",
  "errorCode": "INVALID_DURATION",
  "isOperational": true
}
```

### 400 Bad Request - Missing Date Range

```json
{
  "status": "error",
  "message": "Start date and end date are required for custom range",
  "errorCode": "MISSING_DATE_RANGE",
  "isOperational": true
}
```

## Advanced Use Cases

### 1. Cross-Farm Analysis

Compare performance across multiple farms:

```bash
curl -X GET "http://localhost:5000/api/reports/universal?farmIds=64a1b2c3d4e5f6789012346,64a1b2c3d4e5f6789012347,64a1b2c3d4e5f6789012348&duration=monthly&includeDetails=false" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Buyer Performance Comparison

Compare multiple buyers' performance:

```bash
curl -X GET "http://localhost:5000/api/reports/universal?buyerIds=64a1b2c3d4e5f6789012345,64a1b2c3d4e5f6789012346&duration=quarterly&sortBy=totalAmount&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Shed Efficiency Analysis

Analyze specific sheds across different farms:

```bash
curl -X GET "http://localhost:5000/api/reports/universal?shedIds=64a1b2c3d4e5f6789012349,64a1b2c3d4e5f6789012350&duration=monthly&minNetWeight=1000" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Payment Status Analysis

Analyze unpaid transactions across entities:

```bash
curl -X GET "http://localhost:5000/api/reports/universal?paymentStatus=unpaid&duration=monthly&minAmount=5000" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Driver Performance Report

Track driver performance across all entities:

```bash
curl -X GET "http://localhost:5000/api/reports/universal?driverNames=Ahmed Ali,Sara Khan,John Doe&duration=monthly&sortBy=totalAmount&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Performance Considerations

- The endpoint uses MongoDB aggregation pipelines for optimal performance
- Pagination is implemented to handle large datasets efficiently
- Indexes on frequently queried fields ensure fast queries
- Maximum limit is capped at 1000 transactions per request
- Grouping can be disabled (`includeDetails=false`) for summary-only reports

## Migration from Existing Endpoints

This universal endpoint can replace ALL existing report endpoints:

- `GET /api/reports/buyer/:buyerId/daily/:date` → `GET /api/reports/universal?buyerIds=:buyerId&duration=daily&date=:date`
- `GET /api/reports/buyer/:buyerId/overall` → `GET /api/reports/universal?buyerIds=:buyerId&duration=yearly`
- `GET /api/reports/farm/:farmId/daily/:date` → `GET /api/reports/universal?farmIds=:farmId&duration=daily&date=:date`
- `GET /api/reports/farm/:farmId/overall` → `GET /api/reports/universal?farmIds=:farmId&duration=yearly`
- `GET /api/reports/flock/:flockId/daily/:date` → `GET /api/reports/universal?flockIds=:flockId&duration=daily&date=:date`
- `GET /api/reports/flock/:flockId/overall` → `GET /api/reports/universal?flockIds=:flockId&duration=yearly`
- `GET /api/reports/shed/:shedId/daily/:date` → `GET /api/reports/universal?shedIds=:shedId&duration=daily&date=:date`
- `GET /api/reports/shed/:shedId/overall` → `GET /api/reports/universal?shedIds=:shedId&duration=yearly`

## Summary

The Universal Reports API provides unprecedented flexibility for generating reports. It can handle:

✅ **Any combination of entities** (buyers, farms, flocks, sheds)
✅ **Any time duration** (daily, weekly, monthly, yearly, custom, period)
✅ **Any custom filters** (payment status, amounts, weights, vehicles, drivers, etc.)
✅ **Flexible grouping** (by entity type or no grouping)
✅ **Advanced sorting and pagination**
✅ **Summary and detailed views**
✅ **Cross-entity analysis**
✅ **Performance optimization**

This single endpoint can replace all existing report endpoints while providing much more power and flexibility for complex reporting scenarios.
