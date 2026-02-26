#!/bin/bash
# Deploy Firebase MCP Server to GCP Cloud Run
# Run from: mcp-servers/firebase-mcp/
#
# Prerequisites:
#   - gcloud CLI authenticated: gcloud auth login
#   - APIs enabled: Cloud Build, Cloud Run, Container Registry
#   - Service account needs Firebase Hosting Admin role
#
# Usage:
#   ./deploy-cloud-run.sh

set -euo pipefail

# ── Config ───────────────────────────────────────────────────────────────────
GCP_PROJECT="baseline-pages-hub"
REGION="us-central1"
SERVICE_NAME="firebase-mcp"
IMAGE="gcr.io/$GCP_PROJECT/$SERVICE_NAME"

# ── Build TypeScript ──────────────────────────────────────────────────────────
echo "Building TypeScript..."
npm run build

# ── Build and push Docker image ───────────────────────────────────────────────
echo "Building and pushing Docker image: $IMAGE"
gcloud builds submit --tag "$IMAGE" --project "$GCP_PROJECT" .

# ── Deploy to Cloud Run ───────────────────────────────────────────────────────
echo "Deploying to Cloud Run: $SERVICE_NAME in $REGION"
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE" \
  --region "$REGION" \
  --project "$GCP_PROJECT" \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="MODE=http" \
  --port 8080 \
  --min-instances 0 \
  --max-instances 5 \
  --memory 256Mi \
  --cpu 1

# ── Print URL ────────────────────────────────────────────────────────────────
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
  --region "$REGION" \
  --project "$GCP_PROJECT" \
  --format "value(status.url)")

echo ""
echo "Deployed successfully!"
echo "Service URL: $SERVICE_URL"
echo ""
echo "MCP endpoint for cloud agents:"
echo "  $SERVICE_URL/mcp"
echo ""
echo "Add to your agent MCP config:"
echo '  {'
echo '    "type": "url",'
echo "    \"url\": \"$SERVICE_URL/mcp\""
echo '  }'
