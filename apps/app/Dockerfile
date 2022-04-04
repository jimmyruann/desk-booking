FROM nginx:stable-alpine

WORKDIR /app

ENV NODE_ENV production

COPY ./apps/app/container /

COPY ./dist/apps/app /usr/share/nginx/html

CMD /bin/sh -c "cat /etc/nginx/nginx.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"