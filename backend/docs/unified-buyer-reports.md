# Unified Buyer Reports API

## Overview

The Unified Buyer Reports API provides a powerful, flexible endpoint for generating comprehensive buyer reports with various time durations and filtering options. This single endpoint replaces the need for multiple specific report endpoints by accepting query parameters to customize the report generation.

## Endpoint

```
GET /api/reports/buyer/:buyerId/unified
```

## Authentication

All requests require authentication via the `authHandler` middleware.

## Required Parameters

### Path Parameters

- `buyerId` (string, required): The MongoDB ObjectId of the buyer

## Query Parameters

### Time Duration Parameters

| Parameter   | Type   | Default   | Description                                                                    |
| ----------- | ------ | --------- | ------------------------------------------------------------------------------ |
| `duration`  | string | `"daily"` | Time duration type: `daily`, `weekly`, `monthly`, `yearly`, `custom`, `period` |
| `date`      | string | -         | Specific date for daily/weekly/monthly/yearly reports (YYYY-MM-DD format)      |
| `startDate` | string | -         | Start date for custom range (YYYY-MM-DD format)                                |
| `endDate`   | string | -         | End date for custom range (YYYY-MM-DD format)                                  |
| `period`    | number | -         | Number of days to go back (for `period` duration)                              |

### Filtering Parameters

| Parameter       | Type   | Description                                           |
| --------------- | ------ | ----------------------------------------------------- |
| `farmId`        | string | Filter by specific farm (MongoDB ObjectId)            |
| `flockId`       | string | Filter by specific flock (MongoDB ObjectId)           |
| `shedId`        | string | Filter by specific shed (MongoDB ObjectId)            |
| `paymentStatus` | string | Filter by payment status: `paid`, `partial`, `unpaid` |
| `minAmount`     | number | Minimum total amount filter                           |
| `maxAmount`     | number | Maximum total amount filter                           |
| `minNetWeight`  | number | Minimum net weight filter                             |
| `maxNetWeight`  | number | Maximum net weight filter                             |

### Sorting and Pagination Parameters

| Parameter   | Type   | Default  | Description                                                                                                                                          |
| ----------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sortBy`    | string | `"date"` | Field to sort by: `date`, `totalAmount`, `amountPaid`, `netWeight`, `numberOfBirds`, `rate`, `vehicleNumber`, `driverName`, `createdAt`, `updatedAt` |
| `sortOrder` | string | `"desc"` | Sort order: `asc` or `desc`                                                                                                                          |
| `limit`     | number | `100`    | Number of transactions to return (max: 1000)                                                                                                         |
| `offset`    | number | `0`      | Number of transactions to skip for pagination                                                                                                        |

## Duration Types

### 1. Daily Reports

```
GET /api/reports/buyer/64a1b2c3d4e5f6789012345/unified?duration=daily&date=2024-01-15
```

- Requires: `date` parameter
- Returns: All transactions for the specified date

### 2. Weekly Reports

```
GET /api/reports/buyer/64a1b2c3d4e5f6789012345/unified?duration=weekly&date=2024-01-15
```

- Optional: `date` parameter (defaults to current date)
- Returns: All transactions for the week containing the specified date

### 3. Monthly Reports

```
GET /api/reports/buyer/64a1b2c3d4e5f6789012345/unified?duration=monthly&date=2024-01-15
```

- Optional: `date` parameter (defaults to current date)
- Returns: All transactions for the month containing the specified date

### 4. Yearly Reports

```
GET /api/reports/buyer/64a1b2c3d4e5f6789012345/unified?duration=yearly&date=2024-01-15
```

- Optional: `date` parameter (defaults to current date)
- Returns: All transactions for the year containing the specified date

### 5. Custom Range Reports

```
GET /api/reports/buyer/64a1b2c3d4e5f6789012345/unified?duration=custom&startDate=2024-01-01&endDate=2024-01-31
```

- Requires: `startDate` and `endDate` parameters
- Returns: All transactions within the specified date range

### 6. Period Reports

```
GET /api/reports/buyer/64a1b2c3d4e5f6789012345/unified?duration=period&period=7
```

- Requires: `period` parameter
- Returns: All transactions for the last N days

## Example Requests

### Basic Daily Report

```bash
curl -X GET "http://localhost:5000/api/reports/buyer/64a1b2c3d4e5f6789012345/unified?duration=daily&date=2024-01-15" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Weekly Report with Filters

```bash
curl -X GET "http://localhost:5000/api/reports/buyer/64a1b2c3d4e5f6789012345/unified?duration=weekly&date=2024-01-15&paymentStatus=unpaid&minAmount=1000" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Custom Range with Pagination

```bash
curl -X GET "http://localhost:5000/api/reports/buyer/64a1b2c3d4e5f6789012345/unified?duration=custom&startDate=2024-01-01&endDate=2024-01-31&limit=50&offset=0&sortBy=totalAmount&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Last 30 Days with Farm Filter

```bash
curl -X GET "http://localhost:5000/api/reports/buyer/64a1b2c3d4e5f6789012345/unified?duration=period&period=30&farmId=64a1b2c3d4e5f6789012346" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Response Format

### Success Response (200 OK)

```json
{
  "status": "success",
  "message": "Buyer unified report fetched successfully",
  "data": {
    "buyer": {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "John Doe",
      "contactNumber": "+92-300-1234567",
      "address": "123 Main Street, Karachi"
    },
    "reportTitle": "Daily Report for 2024-01-15",
    "dateRange": {
      "from": "2024-01-15",
      "to": "2024-01-15"
    },
    "summary": {
      "totalTransactions": 5,
      "totalEmptyVehicleWeight": 2500.5,
      "totalGrossWeight": 8500.75,
      "totalNetWeight": 6000.25,
      "totalBirds": 300,
      "totalRate": 15000.0,
      "totalAmount": 90000.0,
      "totalPaid": 45000.0,
      "totalBalance": 45000.0,
      "averageRate": 3000.0,
      "averageNetWeight": 1200.05,
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
        "emptyVehicleWeight": 500.25,
        "grossWeight": 1700.5,
        "netWeight": 1200.25,
        "numberOfBirds": 60,
        "rate": 3000.0,
        "totalAmount": 18000.0,
        "amountPaid": 9000.0,
        "balance": 9000.0,
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
      "total": 5,
      "hasMore": false
    }
  }
}
```

### No Data Response (200 OK)

```json
{
  "status": "success",
  "message": "Buyer unified report fetched successfully",
  "data": {
    "buyer": {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "John Doe",
      "contactNumber": "+92-300-1234567",
      "address": "123 Main Street, Karachi"
    },
    "reportTitle": "Daily Report for 2024-01-15",
    "dateRange": null,
    "summary": {
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
    "transactions": [],
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

### 400 Bad Request - Missing Buyer ID

```json
{
  "status": "error",
  "message": "Buyer ID is required",
  "errorCode": "MISSING_BUYER_ID",
  "isOperational": true
}
```

### 400 Bad Request - Invalid Buyer ID

```json
{
  "status": "error",
  "message": "Invalid buyer ID format",
  "errorCode": "INVALID_BUYER_ID",
  "isOperational": true
}
```

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

## Summary Fields Explained

- `totalTransactions`: Total number of transactions in the report
- `totalEmptyVehicleWeight`: Sum of all empty vehicle weights
- `totalGrossWeight`: Sum of all gross weights
- `totalNetWeight`: Sum of all net weights
- `totalBirds`: Total number of birds across all transactions
- `totalRate`: Sum of all rates (not typically meaningful, but included for completeness)
- `totalAmount`: Total amount across all transactions
- `totalPaid`: Total amount paid across all transactions
- `totalBalance`: Total outstanding balance (totalAmount - totalPaid)
- `averageRate`: Average rate per transaction
- `averageNetWeight`: Average net weight per transaction
- `averageBirdsPerTransaction`: Average number of birds per transaction

## Performance Considerations

- The endpoint uses MongoDB aggregation pipelines for optimal performance
- Pagination is implemented to handle large datasets efficiently
- Indexes on `buyerId`, `date`, and other frequently queried fields ensure fast queries
- Maximum limit is capped at 1000 transactions per request to prevent performance issues

## Usage Tips

1. **Use appropriate duration types** for your use case to get the most relevant data
2. **Apply filters** to narrow down results and improve performance
3. **Use pagination** for large datasets to avoid timeout issues
4. **Sort results** by relevant fields to get the most important data first
5. **Cache results** on the frontend for frequently accessed reports

## Migration from Existing Endpoints

This unified endpoint can replace the following existing endpoints:

- `GET /api/reports/buyer/:buyerId/daily/:date` → Use `duration=daily&date=:date`
- `GET /api/reports/buyer/:buyerId/overall` → Use `duration=yearly` or `duration=custom` with appropriate date range

The unified endpoint provides more flexibility and better performance compared to the existing specific endpoints.
