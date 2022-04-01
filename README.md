# Desk Booking

This is a fullstack web application built with:

- React.js, Nest.js, Postgres

This fullstack application is best to run on container services (Docker, Kubernetes).

## Get started

### Development:

You will need to create a `.env` file in the root directory containing the following:

| ENV_VARIABLE           | Required | Description                  | Example                                    |
| ---------------------- | -------- | ---------------------------- | ------------------------------------------ |
| DATABASE_URL           | ✔️       | Postgres database URL        | postgres://user:pass@host:port/db          |
| REDIS_URL              | ✔️       | Redis database URL           | redis://localhost:6379                     |
| ADMIN_INITIAL_PASSWORD | ✔️       | Password                     | example_password                           |
| HCAPTCHA_SECRET        | ✔️       | hCaptcha secret              | 0x0000000000000000000000000000000000000000 |
| APP_SESSION_SECRET     | ✔️       | Secret for securing sessions | example_secret                             |
| TZ                     |          | Default timezone for backend | UTC                                        |

```
yarn install

## Docker compose file
docker-compose -f docker/docker-compose.dev.yaml up -d

## DB Migration
yarn prisma migrate deploy

## DB Seed
yarn prisma db seed

# Start development API
yarn nx serve api

# Start development APP
yarn nx serve app
```

API documentation (only available on development environment): [Swagger](http://localhost:4200/api)

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
- Use d3 v6.7.0 because test will fail. Jest currently not support d3 v7 ECMAScript.
