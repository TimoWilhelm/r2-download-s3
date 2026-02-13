# r2-download-s3

A Cloudflare Worker that generates presigned URLs for downloading files from R2 via the S3-compatible API.

## How It Works

- `GET /api/download` — Returns a `307` redirect to a presigned R2 download URL (expires in 15 minutes).
- All other routes serve static assets from `public/` (SPA mode).

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- A Cloudflare account with an R2 bucket
- R2 API credentials (Access Key ID + Secret)

## Creating an R2 API Token

1. Go to the [Cloudflare dashboard](https://dash.cloudflare.com/) and navigate to **R2 Object Storage > Overview**.
2. On the right sidebar, select **Manage R2 API Tokens**.
3. Select **Create API token**.
4. Give the token a descriptive name (e.g. `r2-download-s3`).
5. Under **Permissions**, select **Object Read only** (this worker only needs read access).
6. Optionally scope the token to a specific bucket under **Specify bucket(s)**.
7. Select **Create API Token**.
8. Copy the **Access Key ID** and **Secret Access Key** — you won't be able to see the secret again.

Use these values along with your **Account ID** (visible on the R2 Overview page) to populate `.dev.vars`.

## Getting Started

1. **Install dependencies**

   ```sh
   npm install
   ```

2. **Configure environment variables**

   Copy the example file and fill in your credentials:

   ```sh
   cp .dev.vars.example .dev.vars
   ```

   | Variable | Description |
   | --- | --- |
   | `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
   | `R2_ACCESS_KEY_ID` | R2 S3-compatible API access key ID |
   | `R2_ACCESS_KEY_SECRET` | R2 S3-compatible API secret access key |
   | `R2_BUCKET_NAME` | Name of the R2 bucket to download from |
   | `R2_FILE_NAME` | Object key (file name) to serve for download |

3. **Run locally**

   ```sh
   npm run dev
   ```

4. **Deploy**

   ```sh
   npm run deploy
   ```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start local dev server |
| `npm run deploy` | Deploy to Cloudflare |
| `npm test` | Run tests (Vitest) |
| `npm run cf-typegen` | Regenerate Worker type bindings |
