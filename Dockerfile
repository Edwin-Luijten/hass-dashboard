ARG BUILD_FROM=ghcr.io/hassio-addons/base:latest
FROM $BUILD_FROM

COPY rootfs /

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apk add --no-cache nginx nodejs npm

WORKDIR /tmp

COPY package.json /tmp
COPY package-lock.json /tmp

RUN npm install --no-audit --no-fund --no-update-notifier

COPY ./ ./

RUN npm run build

RUN mv ./build /var/www/html

RUN rm -rf /tmp

HEALTHCHECK --start-period=10m \
    CMD curl --fail http://127.0.0.1:46836 || exit 1

CMD [ "nginx","-g","error_log /dev/stdout debug;" ]