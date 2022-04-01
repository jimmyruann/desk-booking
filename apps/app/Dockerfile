FROM nginx

WORKDIR /app

ARG API_HOST
ARG API_PORT

ENV NODE_ENV production

ENV API_HOST ${API_HOST}
ENV API_PORT ${API_PORT}

COPY ./apps/app/container /

COPY ./dist/apps/app /usr/share/nginx/html

CMD /bin/bash -c "envsubst '\$API_HOST \$API_PORT' < /etc/nginx/nginx.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"