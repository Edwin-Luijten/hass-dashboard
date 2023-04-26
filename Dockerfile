ARG BUILD_FROM=ghcr.io/hassio-addons/base:13.2.2
FROM $BUILD_FROM

COPY rootfs /

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apk add --no-cache nginx=1.22.1-r0 nodejs=18.14.2-r0 npm=9.1.2-r0

WORKDIR /tmp

COPY package.json /tmp
COPY package-lock.json /tmp

RUN npm install --no-audit --no-fund --no-update-notifier

COPY ./ ./

RUN npm run build && npm run build:server

RUN mv ./build /var/www/html

RUN rm -rf /tmp

HEALTHCHECK --start-period=10m \
    CMD curl --fail http://127.0.0.1:46836 || exit 1

CMD [ "nginx","-g","error_log /dev/stdout debug;" ]