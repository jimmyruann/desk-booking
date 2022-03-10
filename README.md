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
```

Note

- Preferably Database to be hosted on a fully managed DB service (AWS RDS, or EC2).
