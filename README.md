# Nepal Relief Connect

Nepal Relief Connect combines a live relief operations dashboard with human stories from affected communities. It includes public needs and offers, verified operational updates, a story magazine, media uploads, and a protected administration console.

## Requirements

- Node.js 22.13 or newer
- npm
- A Cloudflare-compatible deployment environment with:
  - D1 database binding named `DB`
  - R2 bucket binding named `MEDIA`
  - authenticated-user email support
  - `ADMIN_EMAILS` configured as a comma-separated list of administrator email addresses

## Run locally

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open the local address printed by the development server.

## Build

```sh
npm run build
```

Database schemas are versioned in `drizzle/`. Apply them in numerical order when provisioning a new D1 database.

## Deployment notes

This application uses Cloudflare D1 for structured records and R2 for uploaded media. A conventional Node-only server will need equivalent bindings or an adapter for those services. Never commit administrator addresses, passwords, API keys, or production environment files to the repository.

## Administration

The admin console is available at `/admin`. Access requires an authenticated email address listed in `ADMIN_EMAILS`; the project intentionally does not use a shared administrator password.
