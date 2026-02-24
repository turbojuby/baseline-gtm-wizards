#!/bin/bash
# Deploy Fathom MCP Server to GCP Cloud Run
# Run from: mcp-servers/fathom-mcp/
#
# Prerequisites:
#   - gcloud CLI authenticated: gcloud auth login
#   - APIs enabled: Cloud Build, Cloud Run, Container Registry, Firestore
#   - Env vars set (see below)
#
# Usage:
#   export OAUTH_CLIENT_ID=991974240717-pster6g1ln8ip8bki9gq3km4gnimb4vt.apps.googleusercontent.com
#   export OAUTH_CLIENT_SECRET=...
#   export OAUTH_JWT_SECRET=...
#   export FATHOM_CLIENT_ID=...
#   export FATHOM_CLIENT_SECRET=...
#   ./deploy-cloud-run.sh

set -euo pipefail

# ── Config ───────────────────────────────────────────────────────────────────
GCP_PROJECT="g-workspace-apis"
REGION="us-central1"
SERVICE_NAME="fathom-mcp"
IMAGE="gcr.io/$GCP_PROJECT/$SERVICE_NAME"
SERVICE_URL="https://fathom-mcp-991974240717.us-central1.run.app"

# ── Validate env vars ─────────────────────────────────────────────────────────
for var in OAUTH_CLIENT_ID OAUTH_CLIENT_SECRET OAUTH_JWT_SECRET FATHOM_CLIENT_ID FATHOM_CLIENT_SECRET; do
  if [[ -z "${!var:-}" ]]; then
    echo "Error: $var is not set" >&2
    exit 1
  fi
done

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
  --set-env-vars="OAUTH_CLIENT_ID=${OAUTH_CLIENT_ID},OAUTH_CLIENT_SECRET=${OAUTH_CLIENT_SECRET},OAUTH_JWT_SECRET=${OAUTH_JWT_SECRET},FATHOM_CLIENT_ID=${FATHOM_CLIENT_ID},FATHOM_CLIENT_SECRET=${FATHOM_CLIENT_SECRET},MCP_SERVER_URL=${SERVICE_URL}" \
  --port 3456 \
  --min-instances 0 \
  --max-instances 5 \
  --memory 256Mi \
  --cpu 1

# ── Print URL ─────────────────────────────────────────────────────────────────
ACTUAL_URL=$(gcloud run services describe "$SERVICE_NAME" \
  --region "$REGION" \
  --format "value(status.url)")

echo ""
echo "Deployed successfully!"
echo "Service URL: $ACTUAL_URL"
echo ""
echo "MCP endpoint for claude.ai:"
echo "  $ACTUAL_URL/mcp"
echo ""
echo "Health check:"
echo "  curl $ACTUAL_URL/health"
