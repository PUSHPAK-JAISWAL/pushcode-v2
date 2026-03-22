FROM gcc:12-alpine

RUN adduser -D runner

WORKDIR /app

COPY run.sh /run.sh
RUN chmod +x /run.sh

USER runner

ENTRYPOINT ["/run.sh"]