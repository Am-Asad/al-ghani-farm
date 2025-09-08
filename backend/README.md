# Al Ghani Farm Backend

A Node.js/Express backend API for the Al Ghani Farm management system.

## Features

- Express.js server with ES modules
- MongoDB database integration
- Security middleware (Helmet, CORS)
- Request logging (Morgan)
- Environment variable configuration
- Graceful shutdown handling

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. MongoDB Connection Setup

#### Option A: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free account or sign in
3. Create a new cluster
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string
7. Replace `<password>` with your database user password
8. Replace `<dbname>` with your desired database name

#### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/al_ghani_farm`

### 3. Environment Variables

Create a `.env` file in the backend root directory:

```env
PORT=8080
NODE_ENV=development
API_PREFIX=/api/v1
CORS_ORIGIN=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/al_ghani_farm?retryWrites=true&w=majority
DB_NAME=al_ghani_farm
```

**Important:** Replace the MONGODB_URI with your actual connection string!

### 4. Start the Server

#### Development (with auto-restart):

```bash
npm run dev
```

#### Production:

```bash
npm start
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /db-test` - Database connection test

## Database Connection

The backend automatically connects to MongoDB when the server starts. The connection includes:

- Connection pooling (max 10 connections)
- Automatic reconnection
- Graceful shutdown
- Error handling

## Project Structure

```
backend/
├── src/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   ├── config/
│   │   ├── database.js     # MongoDB connection config
│   │   └── index.js        # Config exports
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── database/          # Database operations
│   └── validations/       # Data validation
├── tests/                 # Test files
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
└── package.json          # Dependencies and scripts
```

## Troubleshooting

### Connection Issues

1. Check your MONGODB_URI in the .env file
2. Ensure your IP is whitelisted in MongoDB Atlas
3. Verify username/password are correct
4. Check if MongoDB service is running (for local setup)

### Port Issues

- Default port is 8080
- Change PORT in .env if needed
- Ensure port is not used by other services

## Security Notes

- Never commit your .env file to version control
- Use strong passwords for database users
- Enable network access restrictions in MongoDB Atlas
- Use environment-specific configurations
