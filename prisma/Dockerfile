FROM node:14.19.0-alpine

WORKDIR /app

ARG DATABASE_URL

ARG ADMIN_INITIAL_PASSWORD

ENV DATABASE_URL ${DATABASE_URL}

ENV ADMIN_INITIAL_PASSWORD ${ADMIN_INITIAL_PASSWORD}

COPY package.json ./

COPY prisma ./prisma/

RUN npm install -g prisma

RUN npm install bcryptjs

RUN prisma generate

CMD ["sh", "-c", "prisma migrate deploy && prisma db seed && tail -f /dev/null"]