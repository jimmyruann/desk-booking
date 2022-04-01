FROM node:16-alpine

WORKDIR /app

ARG DATABASE_URL
ARG ADMIN_INITIAL_PASSWORD

ENV DATABASE_URL ${DATABASE_URL}
ENV ADMIN_INITIAL_PASSWORD ${ADMIN_INITIAL_PASSWORD}

COPY yarn.lock ./

COPY prisma ./prisma/

COPY ./dist/apps/prisma .

RUN npx prisma generate

RUN yarn install --production --frozen-lockfile 

CMD ["sh", "-c", "npx prisma migrate deploy && node main.js && tail -f /dev/null"]