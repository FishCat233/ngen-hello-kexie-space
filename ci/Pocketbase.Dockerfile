FROM ghcr.io/muchobien/pocketbase:0.40.2

COPY pocketbase/pb_migrations /pb_migrations
COPY ci/pocketbase-entrypoint.sh /usr/local/bin/ngen-pocketbase-entrypoint.sh

RUN chmod +x /usr/local/bin/ngen-pocketbase-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/ngen-pocketbase-entrypoint.sh"]
