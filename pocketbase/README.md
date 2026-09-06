# PocketBase

`pb_data` stores the live database and is intentionally ignored by Git. The
schema migrations are baked into the PocketBase image by the release workflow
and applied to `pb_data` when the container starts.

## First Setup

1. Pull and start the services with `docker compose pull && docker compose up -d`.
2. Create the first administrator through `/_/`, or run PocketBase's
   `superuser create` command inside the container.
3. From a local project checkout, import the existing static content:

```bash
PB_URL=http://127.0.0.1:8090 \
PB_EMAIL=admin@example.com \
PB_PASSWORD='replace-with-your-password' \
pnpm run cms:import
```

The import uses `legacyId` to update existing records, so it can be run again
after correcting the seed data. It does not store administrator credentials in
the repository.

The public collections are `members`, `projects`, and `gallery`. Their list and
view rules are public; create, update, and delete remain administrator-only.

The deployment host does not need a repository checkout or migration files. It
only needs the Compose file and the ignored `pocketbase/pb_data` volume. A new
PocketBase container applies the embedded migration automatically; content is
still imported separately because administrator credentials and live records
must not be included in an image.
