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

COPY yarn.lock ./

COPY prisma ./prisma/

COPY ./dist/apps/api .

RUN yarn install --production

CMD ["node", "main.js"]