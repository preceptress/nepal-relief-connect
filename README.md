# Nepal Relief Connect

Nepal Relief Connect is a public relief-information and community-story platform for Nepal. It combines a verified operations dashboard, administrator workflow, story magazine, moderated media uploads, AI assistance, and optional human-support handoff.

> **Pre-launch safety note:** This project is not an emergency dispatch service. Public operational information appears only after an authorized coordinator publishes it. Visitors in immediate danger should contact verified local emergency services and trusted people nearby.

## Contents

- [What the application does](#what-the-application-does)
- [Architecture](#architecture)
- [Quick start](#quick-start)
- [Complete environment setup](#complete-environment-setup)
- [Environment variables](#environment-variables)
- [Database and storage](#database-and-storage)
- [Table reference](#table-reference)
- [API reference](#api-reference)
- [Code walkthrough](#code-walkthrough)
- [Administration and publishing](#administration-and-publishing)
- [Development commands](#development-commands)
- [Deployment](#deployment)
- [Security and safety](#security-and-safety)
- [FAQ](#faq)

## What the application does

### Public experience

- Displays published relief requests, offers, updates, alerts, organizations, and map records.
- Calculates public summary counts from published or resolved records.
- Presents a magazine-style collection of stories from communities across Nepal.
- Accepts moderated story submissions with an optional image or short video.
- Serves uploaded media only after its associated story is published.
- Provides a floating AI assistant powered by the OpenAI Responses API.
- Shows human-support availability only when a support channel is explicitly configured.

### Coordinator experience

- Protects administrative routes with Sign in with ChatGPT identity headers.
- Restricts access to email addresses in `ADMIN_EMAILS`.
- Creates and reviews operational records.
- Changes record priority and publication status.
- Reviews, publishes, or rejects submitted stories.
- Records operational changes in an audit log.

## Architecture

```text
Visitor browser
   |
   +-- Public page and story magazine
   +-- Story submission form
   +-- AI/human-support chat widget
   |
Vinext / Next.js application on OpenAI Sites
   |
   +-- D1 binding: DB
   |     +-- stories
   |     +-- operations_records
   |     +-- audit_log
   |
   +-- R2 binding: MEDIA
   |     +-- moderated story images and videos
   |
   +-- OpenAI Responses API
   |     +-- server-side AI answers
   |
   +-- Optional external human-support URL
```

### Main technologies

| Layer | Technology |
| --- | --- |
| UI | React 19, Next.js 16 app router, Tailwind CSS import, project CSS |
| Runtime/build | Vinext, Vite, Cloudflare Workers compatibility |
| Hosting | OpenAI Sites |
| Relational data | Cloudflare D1 / SQLite |
| Uploaded media | Cloudflare R2 |
| Authentication | Sign in with ChatGPT headers supplied by the hosting environment |
| AI chat | OpenAI Responses API |

## Quick start

### Requirements

- Node.js 22.13 or newer
- npm
- A local environment capable of running the Cloudflare/Vinext development runtime

### Install and run

```sh
git clone https://github.com/preceptress/nepal-relief-connect.git
cd nepal-relief-connect
npm install
cp .env.example .env.local
npm run dev
```

Open the local URL printed by the development server, normally `http://localhost:3000`.

The local Sites development identity is accepted as an administrator. Production administration still requires an authenticated email in `ADMIN_EMAILS`.

### Configure local AI chat

Set `OPENAI_API_KEY` in `.env.local`. Never commit `.env.local` or paste the key into client-side code.

```dotenv
OPENAI_API_KEY=your-key-in-your-local-file
OPENAI_CHAT_MODEL=gpt-5.4-mini
```

The browser sends chat messages to `/api/chat`; only the server contacts OpenAI.

### Enable human-support handoff

Human availability is true only when both values are present:

```dotenv
HUMAN_CHAT_AVAILABLE=true
HUMAN_SUPPORT_URL=https://your-secure-support-channel.example
```

When selected, the visitor is sent to that support channel. The current application does not persist a live human conversation in D1.

## Complete environment setup

This section is for a contributor starting from a new computer. The project does **not** use Python, Flask, PostgreSQL, `pip`, or a Python virtual environment.

### 1. Install the required tools

Install:

- Git
- Node.js 22.13 or newer
- npm, which is included with Node.js

Confirm the installations:

```sh
git --version
node --version
npm --version
```

If `node --version` reports an older release, upgrade Node before installing dependencies.

### 2. Get the source code

```sh
git clone https://github.com/preceptress/nepal-relief-connect.git
cd nepal-relief-connect
```

Contributors should normally create a branch rather than work directly on `main`:

```sh
git switch -c your-change-name
```

### 3. Install JavaScript dependencies

Use the committed lockfile for a repeatable installation:

```sh
npm ci
```

Use `npm install` instead when intentionally adding or updating a dependency. Commit the resulting `package-lock.json` change with the dependency change.

### 4. Create the local environment file

```sh
cp .env.example .env.local
```

`.env.local` is for secrets and machine-specific values. Do not commit it. The minimum local file may contain:

```dotenv
ADMIN_EMAILS=you@example.org
OPENAI_API_KEY=
OPENAI_CHAT_MODEL=gpt-5.4-mini
HUMAN_CHAT_AVAILABLE=false
HUMAN_SUPPORT_URL=
```

The public site, story browsing, database-backed screens, and most admin development can run without an OpenAI key. Only live AI replies require `OPENAI_API_KEY`.

### 5. Understand local D1 and R2

The application expects two Cloudflare-compatible bindings:

- `DB`: D1/SQLite-compatible structured data
- `MEDIA`: R2-compatible uploaded objects

The names come from `.openai/hosting.json` and are wired into the local runtime by `vite.config.ts`. Local development uses project-local emulation; contributors do not need to install PostgreSQL or create a database server.

`ensureSchema()` creates missing tables and indexes when an application route first uses the database. To initialize the local schema, start the application and open the home page or any database-backed route.

Local runtime state may be written under generated project directories such as `.wrangler/`. Treat generated local state as disposable unless the project explicitly adopts a fixture or backup workflow.

### 6. Start the development server

```sh
npm run dev
```

Open the exact URL printed by the server. It is normally:

```text
http://localhost:3000/
```

Keep the terminal running while developing. Source changes should refresh through the Vite development environment.

### 7. Verify the local installation

Check these surfaces:

1. `/` loads the public dashboard and story magazine.
2. The chat button opens.
3. `/api/chat` returns JSON describing human availability.
4. `/api/operations` returns a JSON `records` array.
5. `/admin` opens in the local development identity.
6. A story form can be opened without submitting personal test data.

You can also check the public endpoints from another terminal:

```sh
curl http://localhost:3000/api/operations
curl http://localhost:3000/api/chat
```

### 8. Configure AI chat safely

AI chat uses the OpenAI Responses API from the server route. Put an existing project API key in `.env.local` as `OPENAI_API_KEY`; never place it in `ChatWidget.tsx`, browser storage, a URL, or a committed file.

Restart the development server after changing server environment variables. Then open chat and send a non-sensitive test message.

The project defaults to `gpt-5.4-mini`. Change `OPENAI_CHAT_MODEL` only to a model available to the associated OpenAI API project. OpenAI project API keys can be managed through the OpenAI Platform; service-account keys are also project-scoped in the official API reference.

### 9. Configure administrator access

Production admin access requires both:

1. An authenticated user email supplied by the Sites hosting environment.
2. The same normalized email in the comma-separated `ADMIN_EMAILS` value.

Example:

```dotenv
ADMIN_EMAILS=coordinator@example.org,editor@example.org
```

Do not add a shared password to the repository. The local development identity is accepted only to make local admin work possible.

### 10. Configure optional human handoff

The site reports a human as available only when both settings are valid:

```dotenv
HUMAN_CHAT_AVAILABLE=true
HUMAN_SUPPORT_URL=https://support.example.org/secure-channel
```

Use an HTTPS support destination appropriate for the organization. If either value is missing, the widget truthfully reports that human support is offline.

### 11. Run project checks

Before opening a pull request:

```sh
npm run build
npm run lint
```

The build must succeed. If lint reports a known existing issue, do not hide it by disabling rules globally; document it and keep new files clean.

### 12. Prepare a fresh hosted deployment

There are two different contributor paths:

#### Existing Nepal Relief Connect Sites project

Project owners and authorized editors reuse the existing Sites project ID and its platform-managed D1 and R2 resources. Runtime values are configured in Sites, not committed to Git.

Required hosted values are:

```text
ADMIN_EMAILS
OPENAI_API_KEY          # secret, when AI chat is enabled
OPENAI_CHAT_MODEL
HUMAN_CHAT_AVAILABLE
HUMAN_SUPPORT_URL       # treat as sensitive when appropriate
```

Changing a hosted environment value requires a new deployment so the new environment revision becomes active.

#### Independent fork or new organization

Do not deploy a fork using the existing `project_id` in `.openai/hosting.json`. Create a separate OpenAI Sites project with D1 and R2 capabilities, then use the exact project ID returned for that new site. Preserve the logical binding names:

```json
{
  "project_id": "the-id-returned-for-your-new-site",
  "d1": "DB",
  "r2": "MEDIA"
}
```

The project ID above is illustrative only. Never invent or derive a Sites ID. Use the ID supplied by the platform when the site is created or attached.

The deployment package includes the build output, `.openai/hosting.json`, and migrations under `drizzle/`. Apply migrations in numerical order when provisioning storage outside the normal Sites deployment workflow.

### 13. Production verification checklist

After deployment, verify:

- The production URL shows the intended release.
- Public zero states do not claim unverified live data.
- `/api/operations` exposes no contact details or administrator email addresses.
- Admin and story-management routes reject unauthorized accounts.
- Story uploads remain unavailable publicly until publication.
- AI chat answers only when the hosted key is configured.
- Human availability matches the real support-channel status.
- No `.env.local`, API key, contributor email, or private contact data was committed.

### Common setup problems

| Problem | Likely cause | Resolution |
| --- | --- | --- |
| `npm ci` rejects the Node version | Node is older than 22.13 | Upgrade Node and run `npm ci` again. |
| The server starts but AI chat says it is not configured | `OPENAI_API_KEY` is missing from the running server environment | Add it to `.env.local`, restart development, or configure the hosted secret and redeploy. |
| Human support always shows offline | The flag, URL, or both are missing | Set both `HUMAN_CHAT_AVAILABLE=true` and a valid `HUMAN_SUPPORT_URL`. |
| Admin access is denied in production | The authenticated email is absent from `ADMIN_EMAILS` | Add the exact email to the hosted comma-separated allowlist and redeploy. |
| Uploaded media returns 404 | The story is not published or the R2 object is missing | Publish the associated story after review and verify the `MEDIA` binding. |
| Local database data disappears | Local emulator state was cleared | Recreate test records; do not treat local emulator data as a production backup. |
| A fork points at the original site | It retained the original Sites project ID | Create a separate Sites project and replace the hosting metadata with the platform-issued ID. |

## Environment variables

| Variable | Required | Secret | Default | Purpose |
| --- | --- | --- | --- | --- |
| `ADMIN_EMAILS` | Production admin use | No | Empty | Comma-separated administrator email allowlist. |
| `OPENAI_API_KEY` | AI chat | **Yes** | None | Server-side credential for the OpenAI API. |
| `OPENAI_CHAT_MODEL` | No | No | `gpt-5.4-mini` | Model used by `/api/chat`. |
| `HUMAN_CHAT_AVAILABLE` | No | No | `false` | Enables human availability when a support URL also exists. |
| `HUMAN_SUPPORT_URL` | Human handoff | Usually | Empty | Secure external channel opened for human support. |

Production values are managed in Sites runtime settings, not in `.openai/hosting.json`. That file contains only the Sites project and logical resource bindings.

## Database and storage

The logical bindings are declared in `.openai/hosting.json`:

| Binding | Service | Purpose |
| --- | --- | --- |
| `DB` | D1 | Stories, operational records, and audit events |
| `MEDIA` | R2 | Uploaded story images and videos |

Schemas exist in two places:

- `db/schema.ts` supplies idempotent `CREATE TABLE IF NOT EXISTS` statements used by `ensureSchema()`.
- `drizzle/0000_stories.sql` and `drizzle/0001_operations.sql` are deployment migrations.

Timestamps are stored as ISO 8601 text. IDs are generated with `crypto.randomUUID()`.

## Table reference

### `stories`

Stores public-facing community stories and their moderation state.

| Field | SQLite type | Required | Description |
| --- | --- | --- | --- |
| `id` | `TEXT` | Yes | Primary key UUID. |
| `title` | `TEXT` | Yes | Story headline; submissions are limited to 120 characters. |
| `body` | `TEXT` | Yes | Full submitted story; API limit is 12,000 characters. |
| `excerpt` | `TEXT` | Yes | Whitespace-normalized preview generated from the first 220 body characters. |
| `category` | `TEXT` | Yes | One of `Community`, `Resilience`, `Photo Essay`, `Voices`, or `Response`. |
| `location` | `TEXT` | Yes | Human-readable Nepal location. |
| `author_name` | `TEXT` | Yes | Contributor display name. |
| `author_email` | `TEXT` | Yes | Contributor contact email; not returned by the public story feed. |
| `author_user_id` | `TEXT` | No | Authenticated Sites user ID when supplied by the request. |
| `media_key` | `TEXT` | No | R2 object key, such as `stories/<story-id>.jpg`. |
| `media_type` | `TEXT` | No | Validated MIME type for uploaded media. |
| `status` | `TEXT` | Yes | `pending`, `published`, or `rejected`; defaults to `pending`. |
| `created_at` | `TEXT` | Yes | ISO 8601 submission timestamp. |
| `published_at` | `TEXT` | No | ISO 8601 publication timestamp. |

Index: `idx_stories_status_created(status, created_at DESC)`.

Sample record:

```json
{
  "id": "5ac1685c-b926-4ea3-8411-55fca7cc5f2b",
  "title": "A table long enough for the whole village",
  "body": "Neighbors gathered to share food, conversation and plans for the next harvest.",
  "excerpt": "Neighbors gathered to share food, conversation and plans for the next harvest.",
  "category": "Resilience",
  "location": "Jumla",
  "author_name": "Sample Contributor",
  "author_email": "contributor@example.org",
  "author_user_id": null,
  "media_key": "stories/5ac1685c-b926-4ea3-8411-55fca7cc5f2b.jpg",
  "media_type": "image/jpeg",
  "status": "published",
  "created_at": "2026-08-30T15:00:00.000Z",
  "published_at": "2026-08-30T18:30:00.000Z"
}
```

### `operations_records`

Stores all coordinator-managed relief and public-information records.

| Field | SQLite type | Required | Description |
| --- | --- | --- | --- |
| `id` | `TEXT` | Yes | Primary key UUID. |
| `record_type` | `TEXT` | Yes | `request`, `offer`, `reunification`, `map`, `update`, `organization`, or `alert`. |
| `title` | `TEXT` | Yes | Short record title; admin API limit is 160 characters. |
| `description` | `TEXT` | Yes | Detailed description; defaults to empty and has a 6,000-character API limit. |
| `category` | `TEXT` | Yes | Free-form operational category; defaults to empty. |
| `location` | `TEXT` | Yes | Human-readable location; defaults to empty. |
| `contact_name` | `TEXT` | Yes | Private coordinator contact name; defaults to empty. |
| `contact_email` | `TEXT` | Yes | Private coordinator contact email; defaults to empty. |
| `contact_phone` | `TEXT` | Yes | Private coordinator contact phone; defaults to empty. |
| `priority` | `TEXT` | Yes | `low`, `medium`, `high`, or `critical`; defaults to `medium`. |
| `status` | `TEXT` | Yes | `draft`, `pending`, `verified`, `published`, `resolved`, or `archived`; defaults to `draft`. |
| `latitude` | `REAL` | No | Map latitude. |
| `longitude` | `REAL` | No | Map longitude. |
| `people_count` | `INTEGER` | Yes | Non-negative affected or participating person count; defaults to `0`. |
| `source` | `TEXT` | Yes | Source or verification note; defaults to empty. |
| `created_by` | `TEXT` | Yes | Authenticated administrator email that created the record. |
| `created_at` | `TEXT` | Yes | ISO 8601 creation timestamp. |
| `updated_at` | `TEXT` | Yes | ISO 8601 last-update timestamp. |
| `published_at` | `TEXT` | No | First publication timestamp; cleared if the record leaves `published`. |
| `metadata_json` | `TEXT` | Yes | Extensible JSON object serialized as text; defaults to `{}`. |

Indexes:

- `idx_operations_type_status_updated(record_type, status, updated_at DESC)`
- `idx_operations_status_priority(status, priority, updated_at DESC)`

Sample record:

```json
{
  "id": "7bc56764-959f-4974-9d10-4b29a4e9d14c",
  "record_type": "request",
  "title": "Verified drinking-water request",
  "description": "A verified coordinator reports a temporary drinking-water need.",
  "category": "Food & Water",
  "location": "Sindhupalchowk",
  "contact_name": "Coordinator Name",
  "contact_email": "coordinator@example.org",
  "contact_phone": "+977-000-0000000",
  "priority": "high",
  "status": "published",
  "latitude": 27.9512,
  "longitude": 85.6846,
  "people_count": 75,
  "source": "Verified local coordinator",
  "created_by": "admin@example.org",
  "created_at": "2026-08-30T14:00:00.000Z",
  "updated_at": "2026-08-30T16:00:00.000Z",
  "published_at": "2026-08-30T16:00:00.000Z",
  "metadata_json": "{\"verification_level\":\"coordinator_confirmed\"}"
}
```

### `audit_log`

Stores an append-only history of operational record creation and updates.

| Field | SQLite type | Required | Description |
| --- | --- | --- | --- |
| `id` | `TEXT` | Yes | Primary key UUID for the audit event. |
| `record_id` | `TEXT` | Yes | Related `operations_records.id`. No database foreign key is currently declared. |
| `action` | `TEXT` | Yes | Event name, currently `created` or `updated`. |
| `actor_email` | `TEXT` | Yes | Authenticated administrator responsible for the action. |
| `details_json` | `TEXT` | Yes | Serialized change details; defaults to `{}`. |
| `created_at` | `TEXT` | Yes | ISO 8601 event timestamp. |

Index: `idx_audit_record_created(record_id, created_at DESC)`.

Sample record:

```json
{
  "id": "4f72e66c-4f63-4766-a089-e015e54f60e4",
  "record_id": "7bc56764-959f-4974-9d10-4b29a4e9d14c",
  "action": "updated",
  "actor_email": "admin@example.org",
  "details_json": "{\"from\":{\"status\":\"verified\",\"priority\":\"high\"},\"to\":{\"status\":\"published\",\"priority\":\"high\"}}",
  "created_at": "2026-08-30T16:00:00.000Z"
}
```

## API reference

| Route | Methods | Access | Purpose |
| --- | --- | --- | --- |
| `/api/operations` | `GET` | Public | Returns up to 250 published operational records. Private contact and creator fields are excluded. |
| `/api/admin/operations` | `GET`, `POST`, `PATCH` | Admin | Lists, creates, filters, prioritizes, and changes status for operational records. Writes audit events. |
| `/api/stories` | `GET`, `POST`, `PATCH` | Mixed | Public published-story feed, public submissions, and admin moderation updates. |
| `/api/media/[key]` | `GET` | Public after publication | Streams an R2 object only when its associated story is published. |
| `/api/chat` | `GET`, `POST` | Public | Reports human availability, requests handoff, and sends bounded chat context to OpenAI. |

### Story upload rules

- Accepted types: JPEG, PNG, WebP, MP4, and WebM.
- Maximum file size: 25 MB.
- Objects are stored under `stories/<uuid>.<extension>`.
- Media is not publicly retrievable until the story status is `published`.

### Chat request behavior

- Keeps only the most recent 10 valid user/assistant messages.
- Limits each message sent to the server to 2,000 characters.
- Requests at most 350 output tokens.
- Sets `store: false` on the OpenAI response request.
- Uses a safety-focused system instruction and does not claim to be an emergency service.

## Code walkthrough

```text
app/
  page.tsx                     Public relief dashboard and page composition
  StoryMagazine.tsx            Story filtering, cards, submission form, image ticker
  ChatWidget.tsx               Floating AI and human-handoff interface
  globals.css                  Shared public, editorial, admin, and chat styling
  layout.tsx                   Fonts, metadata, and global layout
  admin/
    page.tsx                   Admin authentication gate
    AdminConsole.tsx           Coordinator dashboard and record management UI
  stories/manage/
    page.tsx                   Editorial authentication gate and initial query
    ManageStories.tsx          Story review, publish, and reject interface
  api/
    operations/route.ts        Sanitized public operations feed
    admin/operations/route.ts  Protected operations CRUD/status workflow
    stories/route.ts           Story feed, upload, and moderation
    media/[key]/route.ts       Publication-gated R2 media delivery
    chat/route.ts              OpenAI request and human availability logic
db/
  schema.ts                    Idempotent SQLite schema declarations
  index.ts                     D1/R2 bindings, TypeScript row types, admin check
drizzle/
  0000_stories.sql             Story schema migration
  0001_operations.sql          Operations and audit migrations
public/                        Static Nepal and story images, favicon, social card
.openai/hosting.json           Sites project plus DB and MEDIA logical bindings
vite.config.ts                 Vinext, Sites, Tailwind, and Cloudflare configuration
```

### Public page data flow

`app/page.tsx` calls `ensureSchema()`, reads published and resolved operational records, groups them by record type, and calculates visible counts. It renders zero-state language instead of inventing live data when no records exist.

### Story flow

`StoryMagazine.tsx` begins with editorial placeholder stories, fetches published submissions from `/api/stories`, merges the two lists, and supports category and sort controls. New submissions enter the `pending` state and require editorial review.

### Operations flow

The admin API validates record type, status, priority, text lengths, coordinates, and person counts. Only `published` records appear in the public operations endpoint. The home page also includes `resolved` records in selected statistics and summaries.

### Authentication flow

The hosting environment supplies `oai-authenticated-user-email`. `isAdmin()` normalizes that email and checks it against `ADMIN_EMAILS`. Production routes do not use a shared password.

### AI and human-support flow

`ChatWidget.tsx` keeps the visible conversation in browser memory and sends recent messages to `/api/chat`. The server reads `OPENAI_API_KEY`, calls `POST /v1/responses`, and returns only the assistant text. Human availability requires both an enabled flag and a configured URL.

## Administration and publishing

### Operations console

Open `/admin` and sign in with an allowed ChatGPT account. The console can create operational records and change their priority or status.

Recommended status lifecycle:

```text
draft -> pending -> verified -> published -> resolved -> archived
```

The database enforces valid statuses but does not enforce that exact transition order. Coordinator policy must supply the review discipline.

### Story review

Open `/stories/manage` as an administrator. Submitted stories may be left pending, published, or rejected. Publication also makes associated R2 media available through the public media endpoint.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Vinext development server. |
| `npm run build` | Produce the deployment build in `dist/`. |
| `npm run start` | Start the built application. |
| `npm run lint` | Run ESLint while ignoring build output. |

## Deployment

The repository is configured for OpenAI Sites. A normal release flow is:

1. Configure `ADMIN_EMAILS` and any chat values in Sites runtime settings.
2. Build with `npm run build`.
3. Apply migrations in numerical order when provisioning a fresh D1 database.
4. Save and deploy the resulting Sites version.
5. Verify the public page, `/api/operations`, story submission, admin access, and chat status.

The production site is [Nepal Relief Connect](https://nepal-relief-connect.preceptress.chatgpt.site/).

## Security and safety

- Never commit API keys, `.env.local`, passwords, or production secrets.
- Keep `OPENAI_API_KEY` server-side.
- Treat contributor email addresses, contact fields, and unpublished stories as private.
- The public operations API intentionally excludes contact details and `created_by`.
- Media access is tied to story publication status.
- Administrator authorization is an email allowlist, not a substitute for broader organizational access policy.
- `metadata_json` and `details_json` are text columns; parse them defensively.
- The chat assistant may be inaccurate and must not be treated as an emergency source.
- Verify sources before changing any operational record to `published`.

## FAQ

### Why does the public dashboard show zero?

The site does not invent operational data. Counts remain zero until authorized coordinators publish verified records.

### Why can I not open the admin console?

You must be signed in through the hosting environment, and your normalized email must appear in `ADMIN_EMAILS`.

### Why does AI chat say it is not configured?

`OPENAI_API_KEY` is missing from the server environment. Adding a key only to your computer does not configure the hosted Sites deployment.

### Is the OpenAI key sent to the browser?

No. The browser calls `/api/chat`; the server reads the key and contacts OpenAI.

### How do I change the chat model?

Set `OPENAI_CHAT_MODEL` in the runtime environment and deploy a new version. The code defaults to `gpt-5.4-mini`.

### When does the site say a human is available?

Only when `HUMAN_CHAT_AVAILABLE=true` and `HUMAN_SUPPORT_URL` is non-empty. This prevents a false online indicator.

### Does the application include a built-in human live-chat queue?

No. Human handoff opens the configured external support URL. A native queue would require additional session, message, assignment, presence, and retention tables plus a coordinator chat interface.

### Where are uploaded files stored?

In the R2 bucket bound as `MEDIA`. D1 stores only the object key and MIME type.

### Why does an uploaded image return 404?

The media endpoint returns content only when it finds a story with the same `media_key` and that story is `published`.

### Can I add another story category?

Update the category allowlist in `app/api/stories/route.ts` and the UI options in `StoryMagazine.tsx`. The database currently stores categories as text and does not enforce a category check constraint.

### Can I add another operations record type?

Update the SQLite check constraint through a migration, the TypeScript union in `db/index.ts`, the API allowlist, and the relevant admin and public UI mappings.

### Does `ensureSchema()` replace migrations?

No. It makes known tables and indexes available idempotently at runtime. Versioned migrations remain the durable deployment history and are required for future schema changes that cannot be expressed as simple `CREATE IF NOT EXISTS` statements.

### Are audit records automatically deleted with an operation?

No. There is no foreign key or delete endpoint for operations records. Audit events remain independent unless a future retention process changes that behavior.

### How should production secrets be changed?

Use the Sites runtime environment controls, mark sensitive values as secrets, and deploy a new version so the new environment revision is active.

## License

The original software source code and project-authored documentation in this repository are licensed under the [Apache License 2.0](LICENSE).

The Apache License does **not** grant rights to third-party photographs, videos, submitted stories, personal data, organization names, or trademarks. Those materials remain subject to their original owners' terms, contributor permissions, privacy rights, and any attribution shown in the application. Do not reuse them unless you have independently confirmed the necessary rights.
