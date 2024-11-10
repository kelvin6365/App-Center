# Full-Stack Monorepo Blueprint

A modern full-stack monorepo starter template built with Turborepo, featuring Next.js for frontend applications and NestJS for backend services.

## Tech Stack

- **Build System**: [Turborepo](https://turbo.build/repo)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Frontend**: [Next.js](https://nextjs.org/) with [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [NestJS](https://nestjs.com/)
- **UI Components**: Shared component library with [shadcn/ui](https://ui.shadcn.com/)
- **Database**: PostgreSQL
- **Caching**: Redis
- **Storage**: MinIO (S3-compatible)

## Project Structure

```
.
├── apps/
│   ├── api/          # NestJS backend application
│   ├── docs/         # Documentation site (Next.js)
│   └── web/          # Main web application (Next.js)
├── packages/
│   ├── ui/           # Shared UI component library
│   ├── eslint-config/# Shared ESLint configurations
│   └── typescript-config/ # Shared TypeScript configurations
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm 8.15.6 or later
- Docker and Docker Compose (for local services)

### Installation

```bash
# Install dependencies
pnpm install

# Start local services (PostgreSQL, Redis, MinIO)
docker compose up -d
```

### Development

```bash
# Start all applications in development mode
pnpm dev

# Start specific applications
pnpm --filter web dev    # Start web app (http://localhost:3000)
pnpm --filter docs dev   # Start docs app (http://localhost:3001)
pnpm --filter api dev    # Start API server (http://localhost:8000)

# Add new UI components
pnpm ui add button      # Add button component to shared UI library
```

### Building

```bash
# Build all applications
pnpm build

# Build specific application
pnpm --filter web build
pnpm --filter api build
```

### Linting and Type Checking

```bash
# Run ESLint across all projects
pnpm lint

# Run type checking
pnpm type-check

# Format code
pnpm format
```

## Local Services

The project includes several local services that can be started using Docker Compose:

### PostgreSQL

- **Port**: 5432
- **Username**: pgsqladmin
- **Password**: Pass!23456
- **Database**: local_logicchat_db

### Redis

- **Port**: 6379
- **Persistence**: Enabled
- **Data Directory**: ./data/redis

### MinIO (S3-compatible storage)

- **API Port**: 9000
- **Console Port**: 9001
- **Access Key**: minoadmin
- **Secret Key**: Pass!23456
- **Default Bucket**: local-bucket
- **Console URL**: http://localhost:9001

## Application URLs

- Web Application: http://localhost:3000
- Documentation: http://localhost:3001
- API Server: http://localhost:8000
- API Documentation: http://localhost:8000/api/docs

## Environment Setup

1. Create environment files:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/docs/.env.example apps/docs/.env
```

2. Configure the environment variables according to your needs. The API service requires:

```env
# Server Configuration
PORT=8000
ENV=development
GLOBAL_PREFIX=api

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=pgsqladmin
DB_PASSWORD=Pass!23456
DB_DATABASE=local_logicchat_db

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minoadmin
MINIO_SECRET_KEY=Pass!23456
MINIO_BUCKET=local-bucket
```

## Contributing

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run tests and linting: `pnpm lint && pnpm type-check`
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature-name`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
