FROM alpine:latest

RUN apk add --no-cache g++ musl-dev

RUN adduser -D runner

WORKDIR /app

COPY run.sh /run.sh
RUN chmod +x /run.sh

USER runner

ENTRYPOINT ["/run.sh"]