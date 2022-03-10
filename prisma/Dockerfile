FROM node:14.19.0-alpine

WORKDIR /app

ARG DATABASE_URL

ENV DATABASE_URL ${DATABASE_URL}

COPY package.json ./

COPY prisma ./prisma/

RUN npm install -g prisma

RUN npm install bcryptjs

RUN prisma generate

CMD ["sh", "-c", "prisma migrate deploy && prisma db seed"]