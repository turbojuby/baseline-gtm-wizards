#!/bin/bash
# Deploy Airtable MCP Server to GCP Cloud Run
# Run from: mcp-servers/airtable-mcp/
#
# Prerequisites:
#   - gcloud CLI authenticated: gcloud auth login
#   - APIs enabled: Cloud Build, Cloud Run, Container Registry
#   - AIRTABLE_PAT and AIRTABLE_BASE_ID set in your shell
#
# Usage:
#   export AIRTABLE_PAT=patXXX...
#   export AIRTABLE_BASE_ID=appXXX...
#   ./deploy-cloud-run.sh

set -euo pipefail

# ── Config ───────────────────────────────────────────────────────────────────
GCP_PROJECT="YOUR_GCP_PROJECT_ID"  # TODO: fill in your GCP project ID
REGION="us-central1"
SERVICE_NAME="airtable-mcp"
IMAGE="gcr.io/$GCP_PROJECT/$SERVICE_NAME"

# ── Validate env vars ─────────────────────────────────────────────────────────
if [[ -z "${AIRTABLE_PAT:-}" ]]; then
  echo "Error: AIRTABLE_PAT is not set" >&2
  exit 1
fi
if [[ -z "${AIRTABLE_BASE_ID:-}" ]]; then
  echo "Error: AIRTABLE_BASE_ID is not set" >&2
  exit 1
fi
if [[ "$GCP_PROJECT" == "YOUR_GCP_PROJECT_ID" ]]; then
  echo "Error: Update GCP_PROJECT in this script before running" >&2
  exit 1
fi

# ── Build TypeScript ──────────────────────────────────────────────────────────
echo "Building TypeScript..."
npm run build

# ── Build and push Docker image ───────────────────────────────────────────────
echo "Building and pushing Docker image: $IMAGE"
gcloud builds submit --tag "$IMAGE" .

# ── Deploy to Cloud Run ───────────────────────────────────────────────────────
echo "Deploying to Cloud Run: $SERVICE_NAME in $REGION"
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE" \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="AIRTABLE_PAT=${AIRTABLE_PAT},AIRTABLE_BASE_ID=${AIRTABLE_BASE_ID},MODE=http" \
  --port 8080 \
  --min-instances 0 \
  --max-instances 5 \
  --memory 256Mi \
  --cpu 1

# ── Print SSE URL ─────────────────────────────────────────────────────────────
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
  --region "$REGION" \
  --format "value(status.url)")

echo ""
echo "Deployed successfully!"
echo "Service URL: $SERVICE_URL"
echo ""
echo "SSE endpoint for cloud agents:"
echo "  $SERVICE_URL/sse"
echo ""
echo "Add to your agent MCP config:"
echo '  {'
echo '    "type": "url",'
echo "    \"url\": \"$SERVICE_URL/sse\""
echo '  }'
