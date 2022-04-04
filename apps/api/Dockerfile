FROM node:16-alpine

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

RUN yarn install --production --frozen-lockfile 

RUN npx prisma generate && rm -rf ~/.npm/_npx && rm -rf ~/.cache/prisma

CMD ["node", "main.js"]