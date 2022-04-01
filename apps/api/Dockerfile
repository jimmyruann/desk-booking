FROM node:14.19.0-alpine

WORKDIR /app

ARG DATABASE_URL
ARG REDIS_URL
ARG HCAPTCHA_SECRET

ENV NODE_ENV production

ENV PORT 3333

ENV DATABASE_URL ${DATABASE_URL}
ENV REDIS_URL ${REDIS_URL}
ENV HCAPTCHA_SECRET ${HCAPTCHA_SECRET}

EXPOSE ${PORT}

COPY package.json yarn.lock ./

COPY prisma ./prisma/

RUN npm install -g prisma

RUN yarn install --production

COPY ./dist/apps/api .

RUN prisma generate

CMD ["node", "main.js"]