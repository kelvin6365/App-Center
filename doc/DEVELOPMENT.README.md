# Local App Center Development Setup

This repository contains the necessary files and instructions to set up the Local App Center development environment using Docker Compose and Nx monorepo.

## Project Structure

The repository follows an Nx monorepo structure and includes the following projects:

1. `backend`: NestJS backend application.
2. `frontend`: Legacy ReactJS frontend application.
3. `portal`: Revamped frontend application using NextJS, ReactJS, and shadcn/ui.
4. `website`: Public website for the SaaS landing page, built with NextJS.

## Prerequisites

Before you begin, ensure that you have the following software installed on your machine:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)
- Node.js: [Install Node.js](https://nodejs.org/)
- pnpm: Install pnpm globally using `npm install -g pnpm`
- Nx CLI: Install the Nx CLI globally using `pnpm add -g nx`

## Getting Started

To set up the Local App Center development environment, follow these steps:

1. Clone this repository to your local machine:

```
git clone https://github.com/kelvin6365/App-Center.git
```

2. Navigate to the project directory:

```
cd App-Center
```

3. Install the dependencies for all projects using pnpm:

```
pnpm install
```

4. Start the Docker containers:

```
cd docker && docker-compose up -d
```

This command will download the required Docker images and start the containers in detached mode.

5. Wait for the containers to start up. You can check the status of the containers using:

```
docker-compose ps
```

6. Access the services:

- PostgreSQL: The database is accessible at `localhost:5432`. Use the credentials specified in the `docker-compose.yml` file.
- Redis: Redis is accessible at `localhost:6379`.
- Minio: The Minio web console is accessible at `http://localhost:9001`. Use the access key and secret key provided in the `docker-compose.yml` file to log in.

7. Run the applications:

- Backend: `pnpm nx serve backend`
- Frontend (Old): `pnpm nx serve frontend`
- Frontend (New): `pnpm nx serve portal`
- Website : `pnpm nx serve website`

8. To stop the containers, run:

```
docker-compose down
```

## Docker Compose Services

The `docker-compose.yml` file defines the following services:

- `db`: PostgreSQL database service.
- `redis`: Redis service.
- `minio`: Minio object storage service.
- `createbuckets`: A utility service to create the necessary Minio buckets on startup.

## Nx Monorepo with pnpm

This repository uses Nx, a powerful monorepo tool, in combination with pnpm as the package manager. Nx provides a set of CLI commands and tools to facilitate development, testing, and building of the projects, while pnpm offers fast and efficient package management.

Some common Nx commands with pnpm:

- `pnpm nx serve <project>`: Serves the specified project.
- `pnpm nx build <project>`: Builds the specified project.
- `pnpm nx test <project>`: Runs tests for the specified project.
- `pnpm nx affected:apps`: Lists the applications affected by changes.
- `pnpm nx affected:libs`: Lists the libraries affected by changes.
- `pnpm nx dep-graph`: Generates a dependency graph of the projects.

For more information on Nx and its capabilities, refer to the [Nx Documentation](https://nx.dev/getting-started/intro).

## Troubleshooting

If you encounter any issues during the setup or while running the applications, consider the following:

- Make sure you have the latest versions of Node.js, pnpm, Docker, and Docker Compose installed.
- Verify that the `docker-compose.yml` file contains the correct Minio access key and secret key.
- Check the logs of the containers for any error messages:

```
docker-compose logs
```

If you need further assistance, please contact the development team or refer to the project's documentation.

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Minio Documentation](https://docs.min.io/)
- [Nx Documentation](https://nx.dev/)
- [pnpm Documentation](https://pnpm.io/motivation)
