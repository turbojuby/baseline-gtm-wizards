---
description: Deploy an HTML file to hub.baselinepayments.com (production) or a quick-share draft URL (internal review).
---

# /gtm:deploy

Deploy an HTML file to hub.baselinepayments.com (production, prospect-facing) or to a quick-share draft URL (internal review). Handles Netlify CLI deployment with the correct site IDs, directory structure, and build overrides.

## Usage

```
/gtm:deploy ~/Desktop/decks/lululemon-teaser-deck.html
/gtm:deploy ~/Desktop/decks/lululemon-teaser-deck.html --draft
/gtm:deploy /path/to/any-file.html
```

**Default (no flag):** Production deploy to `hub.baselinepayments.com/d/{hex}` — prospect-facing, branded subdomain, unguessable URL.

**`--draft` flag:** Draft deploy to quick-share Netlify site — internal review, non-guessable URL, not on the branded domain.

## How It Works

1. **Validate** — Confirm the HTML file exists and is readable
2. **Prepare** — Create temp directory with correct structure and `netlify.toml`
3. **Deploy** — Run Netlify CLI from within the temp directory
4. **Report** — Output the live URL

## Instructions

### Step 1: Validate the File

Read the target HTML file to confirm it exists:

```
Read: <file-path>
```

If the file does not exist, stop and report the error. Do not attempt to deploy.

### Step 2: Determine Deploy Target

Parse the command arguments:
- If `--draft` is present: draft deploy (internal sharing)
- If no flag: production deploy (prospect-facing)

### Step 3a: Production Deploy (Default)

Deploy to `hub.baselinepayments.com` with an unguessable path.

**Site ID:** `f5700f38-35d8-4b71-8d11-615d96717291`

**WARNING:** Each production deploy to this site overwrites the entire site content. If other resources have been previously deployed to `hub.baselinepayments.com/d/...`, they will be removed by this deploy unless they are included in the deploy directory. If unsure, use `--draft` first for review.

Run the following bash commands:

```bash
# Generate a random 16-character hex path (2^64 combinations — unguessable)
PATH_ID=$(openssl rand -hex 8)

# Create temp deploy directory with the /d/{hex} structure
DEPLOY_DIR=$(mktemp -d)
mkdir -p "$DEPLOY_DIR/d/$PATH_ID"

# Copy the HTML file as index.html
cp "<file-path>" "$DEPLOY_DIR/d/$PATH_ID/index.html"

# Create netlify.toml to override team build defaults
printf '[build]\n  command = ""\n  publish = "."\n' > "$DEPLOY_DIR/netlify.toml"

# Deploy — MUST cd into the directory (Netlify uses CWD for build context)
cd "$DEPLOY_DIR" && netlify deploy --dir=. --site=f5700f38-35d8-4b71-8d11-615d96717291 --prod --skip-functions-cache --message "Deploy: <description>"
```

**Live URL:** `https://hub.baselinepayments.com/d/{PATH_ID}`

Replace `<description>` with a brief description of what's being deployed (e.g., "Lululemon teaser deck" or "Acme ROI calculator").

### Step 3b: Draft Deploy (`--draft`)

Deploy to the quick-share Netlify site for internal review.

**Site ID:** `1554d55b-7194-4f8a-be8c-8ad77e26c3a9`

```bash
# Create temp deploy directory
DEPLOY_DIR=$(mktemp -d)

# Copy the HTML file as index.html (flat structure, no /d/ prefix)
cp "<file-path>" "$DEPLOY_DIR/index.html"

# Create netlify.toml to override team build defaults
printf '[build]\n  command = ""\n  publish = "."\n' > "$DEPLOY_DIR/netlify.toml"

# Deploy — no --prod flag, generates a draft URL with random hash
cd "$DEPLOY_DIR" && netlify deploy --dir=. --site=1554d55b-7194-4f8a-be8c-8ad77e26c3a9 --skip-functions-cache --message "Draft: <description>"
```

The Netlify CLI output will include a "Website draft URL" with a random hash subdomain (e.g., `abc123def--quick-share-f58d870368e7.netlify.app`). Extract and report this URL.

### Step 4: Report the URL

**For production deploy:**
```
Deployed to production:
  https://hub.baselinepayments.com/d/{PATH_ID}

Site: baseline-hub (f5700f38-35d8-4b71-8d11-615d96717291)
Source: {original file path}

Note: This URL is unguessable but not password-protected.
Do not deploy sensitive internal documents to production.
```

**For draft deploy:**
```
Deployed as draft:
  {draft-url-from-netlify-output}

Site: quick-share (1554d55b-7194-4f8a-be8c-8ad77e26c3a9)
Source: {original file path}

This is a draft URL for internal review only.
To deploy to production: /gtm:deploy {file} (without --draft)
```

### Important Rules

**Must `cd` into the deploy directory.** The Netlify CLI uses the current working directory for build context. If you run `netlify deploy` from the project root, it picks up the team's default Hugo build command and the deploy fails. Always `cd "$DEPLOY_DIR"` before running `netlify deploy`.

**Must include `netlify.toml`.** The team account has default build settings (Hugo). The `netlify.toml` with an empty build command overrides these defaults. Without it, the deploy will fail with a Hugo build error.

**Production uses `--prod`.** Without `--prod`, Netlify creates a draft deploy even on the production site, which won't be served on the custom domain.

**Draft omits `--prod`.** This generates a deploy preview URL with a random hash that isn't served on any custom domain — good for internal review.

**Each production deploy overwrites everything.** Netlify deploys are atomic — the entire site content is replaced. If `hub.baselinepayments.com/d/abc123` was previously deployed and you deploy a new file to `/d/def456`, the old `abc123` path will 404 unless you include it in the new deploy directory. For this reason:
- Prefer `--draft` for review and iteration
- Only use production deploy for the final version
- If multiple resources need to coexist on the production site, all must be included in a single deploy

**Never deploy sensitive internal documents.** The production site (`hub.baselinepayments.com`) is for prospect/client/partner-facing content. Internal strategy documents, meeting notes, and competitive analysis should use `--draft` only.

## Troubleshooting

### Netlify CLI not found
The Netlify CLI must be installed globally:
```bash
npm install -g netlify-cli
```
And authenticated:
```bash
netlify login
```

### Deploy fails with Hugo build error
This means the `netlify.toml` is missing or not being picked up. Verify:
1. The `netlify.toml` file exists in the deploy directory root (not in a subdirectory)
2. You `cd`'d into the deploy directory before running `netlify deploy`
3. The `netlify.toml` content is exactly: `[build]\n  command = ""\n  publish = "."`

### Draft URL not appearing in output
The Netlify CLI prints the draft URL as "Website draft URL: ..." in its output. Look for this line. If the deploy succeeds but no draft URL is shown, the `--prod` flag may have been accidentally included.

### Previous production content disappeared
This is expected — each deploy replaces the entire site. To restore previous content, you need to include all previously deployed files in the new deploy directory. For critical content, keep track of deployed PATH_IDs and their source files.

### Permission denied on Netlify deploy
Verify the Netlify CLI is authenticated with an account that has access to the target site. Run `netlify status` to check the current auth state.
