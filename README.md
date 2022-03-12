# Desk Booking

This is a fullstack web application built with:

- React.js, Nest.js, Postgres

This fullstack application is best to run on container services (Docker, Kubernetes).

## Get started

### Development:

You will need to create a `.env` file in the root directory containing the following:

| ENV_VARIABLE           | Required | Description                  | Example                           |
| ---------------------- | -------- | ---------------------------- | --------------------------------- |
| DATABASE_URL           | ✔️       | Postgres database URL        | postgres://user:pass@host:port/db |
| ADMIN_INITIAL_PASSWORD | ✔️       | Password                     | example_password                  |
| TZ                     |          | Default timezone for backend | UTC                               |

```
yarn install

# Start Docker PostgreSQL container
# default user is postgres and database is postgres
# construct DATABASE_URL and save it in .env
docker run -d -p :5432:5432 -e POSTGRES_PASSWORD=password postgres

## DB Migration
yarn prisma migrate deploy

## DB Seed
yarn prisma db seed

# Start development API
yarn nx serve api

# Start development APP
yarn nx serve app
```

### Production

```
# Build frontend and build docker image
yarn nx deploy app

# Build api and build docker image
yarn nx deploy api

# Build api and build prisma database migration
yarn nx deploy prisma

### OR - to build all at once
yarn run deploy
```

## Deployment

- Docker: [Readme.MD](/docker/readme.md).
- Kubernetes (Working in progress): [Readme.MD](/kubernetes/readme.md).

Note

- Preferably Database to be hosted on a fully managed DB service (AWS RDS, or EC2).
-
