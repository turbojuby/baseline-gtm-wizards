#!/bin/bash
# Deploy Netlify MCP Server to GCP Cloud Run
# Run from: mcp-servers/netlify-mcp/
#
# Prerequisites:
#   - gcloud CLI authenticated: gcloud auth login
#   - APIs enabled: Cloud Build, Cloud Run, Container Registry
#   - NETLIFY_TOKEN set in your shell
#
# Usage:
#   export NETLIFY_TOKEN=nfp_XXX...
#   ./deploy-cloud-run.sh

set -euo pipefail

# ── Config ───────────────────────────────────────────────────────────────────
GCP_PROJECT="g-workspace-apis"
REGION="us-central1"
SERVICE_NAME="netlify-mcp"
IMAGE="gcr.io/$GCP_PROJECT/$SERVICE_NAME"

# ── Validate env vars ─────────────────────────────────────────────────────────
if [[ -z "${NETLIFY_TOKEN:-}" ]]; then
  echo "Error: NETLIFY_TOKEN is not set" >&2
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
  --set-env-vars="NETLIFY_TOKEN=${NETLIFY_TOKEN},MODE=http" \
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
