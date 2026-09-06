# PocketBase

`pb_data` stores the live database and is intentionally ignored by Git. The
`pb_migrations` directory is mounted into the container and applied by
PocketBase on startup.

## First Setup

1. Start the services with `docker compose up -d`.
2. Create the first administrator through `/_/`, or run PocketBase's
   `superuser create` command inside the container.
3. Import the existing static content from the repository root:

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
