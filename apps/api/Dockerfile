FROM node:14.19.0-alpine

WORKDIR /app

ARG DATABASE_URL
ARG JWT_ACCESS_SECRET
ARG JWT_REFRESH_SECRET

ENV NODE_ENV production

ENV PORT 3333

ENV DATABASE_URL ${DATABASE_URL}
ENV JWT_ACCESS_SECRET ${JWT_ACCESS_SECRET}
ENV JWT_REFRESH_SECRET ${JWT_REFRESH_SECRET}

EXPOSE ${PORT}

COPY package.json ./

COPY prisma ./prisma/

RUN npm install -g prisma

RUN npm install --production

COPY ./dist/apps/api .

RUN prisma generate

CMD ["node", "main.js"]