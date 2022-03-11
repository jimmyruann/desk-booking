# Docker Deployment

## With Database

### Environment Variables

|  Environment Variable  |                 Description                 | Required |
| :--------------------: | :-----------------------------------------: | :------: |
|     POSTGRES_USER      |             PostgreSQL DB User              |    ✔️    |
|   POSTGRES_PASSWORD    |         PostgreSQL DB User Password         |    ✔️    |
|      POSTGRES_DB       |         PostgreSQL DB Database Name         |    ✔️    |
| ADMIN_INITIAL_PASSWORD |    Password when database first migrate     |    ✔️    |
|   JWT_ACCESS_SECRET    |       JWT secret for Access JWT token       |    ✔️    |
|   JWT_REFRESH_SECRET   | JWT secret for Refresh cookie content (JWT) |    ✔️    |

### Steps

```
# Define ENV Variables
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=password
export POSTGRES_DB=db
export ADMIN_INITIAL_PASSWORD=password
export JWT_ACCESS_SECRET=example_secret
export JWT_REFRESH_SECRET=example_secret2

# Create external volume for database
docker volume create --driver local \
    --opt type=none \
    --opt device=/mnt/db \
    --opt o=bind database

# Docker Compose
docker-compose -f docker/docker-compose.yaml up -d
```

## Without Database

### Environment Variables

|  Environment Variable  |                 Description                 | Required |
| :--------------------: | :-----------------------------------------: | :------: |
|      DATABASE_URL      |     PostgreSQL DB URL connection string     |    ✔️    |
| ADMIN_INITIAL_PASSWORD |    Password when database first migrate     |    ✔️    |
|   JWT_ACCESS_SECRET    |       JWT secret for Access JWT token       |    ✔️    |
|   JWT_REFRESH_SECRET   | JWT secret for Refresh cookie content (JWT) |    ✔️    |

### Steps

```
# Define ENV Variables
export DATABASE_URL=postgres://postgres:password@127.0.0.1:5432/db?schema=public
export ADMIN_INITIAL_PASSWORD=password
export JWT_ACCESS_SECRET=example_secret
export JWT_REFRESH_SECRET=example_secret2

# Docker Compose
docker-compose -f docker/docker-compose.no-db.yaml up -d
```
