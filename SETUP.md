# Career Compass - Setup Guide

## Prerequisites
- Docker (for PostgreSQL database)
- Node.js and npm

## Quick Start

### 1. Environment Setup
The `.env` file has been created with the following configuration:
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `ENCRYPTION_KEY` (optional): For encrypting achievement data
- `OPENAI_API_KEY` (optional): For AI coaching features

### 2. Start the Database
```bash
docker compose up -d
```

This starts a PostgreSQL database in a Docker container.

### 3. Initialize the Database Schema
```bash
npm run db:push
```

This creates all necessary tables in your database.

### 4. Start the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Default Credentials
A demo account is automatically created:
- **Username**: demo
- **Password**: demo123

## Troubleshooting

### Registration Failed Error
This error occurs when:
1. Database is not running
2. DATABASE_URL environment variable is not set
3. Database schema is not initialized

**Solution**: Follow the Quick Start steps above.

### Database Connection Issues
If you see "DATABASE_URL must be set" error:
1. Ensure `.env` file exists in project root
2. Verify Docker container is running: `docker ps`
3. Check database connection: `docker exec career-compass-db pg_isready -U postgres`

## Managing the Database

### Stop the database
```bash
docker compose down
```

### Stop and remove all data
```bash
docker compose down -v
```

### View database contents
```bash
docker exec career-compass-db psql -U postgres -d career_compass -c "SELECT * FROM users;"
```

## API Endpoints

### Authentication
- `POST /api/register` - Create new account
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/user` - Get current user

### Achievements
- `GET /api/achievements` - List user achievements
- `POST /api/achievements` - Create achievement
- `POST /api/achievements/:id/coach` - Get AI coaching (requires OPENAI_API_KEY)

## Production Deployment

For production, ensure:
1. Set a strong `SESSION_SECRET`
2. Set a 32+ character `ENCRYPTION_KEY`
3. Use a managed PostgreSQL database (not Docker)
4. Set `NODE_ENV=production`
