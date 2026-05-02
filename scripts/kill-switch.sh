#!/usr/bin/env bash
# Kill Switch — Emergency site takedown for notes.bhaumikkaji.com
# Usage: bash scripts/kill-switch.sh
# Requires: az, swa, SWA_CLI_DEPLOYMENT_TOKEN

set -euo pipefail

APP_NAME="swa-bhaumik-notes"
RESOURCE_GROUP="rg-bhaumik-notes"
DEPLOYMENT_TOKEN="${SWA_CLI_DEPLOYMENT_TOKEN:-}"
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

# ── Validate prerequisites ─────────────────────────────────────────
if ! command -v az >/dev/null 2>&1; then
  echo "[ERROR] Azure CLI (az) not found. Install: https://aka.ms/installazurecli" >&2
  exit 1
fi

if ! command -v swa >/dev/null 2>&1; then
  echo "[ERROR] SWA CLI not found. Install: npm install -g @azure/static-web-apps-cli" >&2
  exit 1
fi

if [ -z "$DEPLOYMENT_TOKEN" ] && [ -f .env ]; then
  DEPLOYMENT_TOKEN=$(grep -E '^SWA_CLI_DEPLOYMENT_TOKEN=' .env 2>/dev/null | cut -d= -f2- || true)
fi

if [ -z "$DEPLOYMENT_TOKEN" ]; then
  echo "[ERROR] SWA_CLI_DEPLOYMENT_TOKEN not set. Export it or add to .env" >&2
  exit 1
fi

# ── Confirm ────────────────────────────────────────────────────────
echo ""
echo "⚠️  KILL SWITCH — This will take notes.bhaumikkaji.com OFFLINE immediately."
echo ""
read -rp "Type 'offline' to confirm: " confirm
if [ "$confirm" != "offline" ]; then
  echo "Aborted."
  exit 0
fi

# ── Build minimal offline page ─────────────────────────────────────
mkdir -p "$TMP_DIR/dist"

cat > "$TMP_DIR/dist/index.html" << 'HTML'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Temporarily Unavailable</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      background: #111;
      color: #888;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 20px;
    }
    h1 { font-size: 1.25rem; font-weight: 500; color: #ccc; margin-bottom: 8px; }
    p { font-size: 0.9rem; line-height: 1.5; }
  </style>
</head>
<body>
  <div>
    <h1>Temporarily Unavailable</h1>
    <p>This site is offline for maintenance.<br>Please check back later.</p>
  </div>
</body>
</html>
HTML

cat > "$TMP_DIR/dist/staticwebapp.config.json" <> 'JSON'
{
  "routes": [
    {
      "route": "/*",
      "rewrite": "/index.html"
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
JSON

# ── Deploy ─────────────────────────────────────────────────────────
echo ""
echo "Deploying offline page..."
swa deploy "$TMP_DIR/dist" \
  --env production \
  --app-name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --deployment-token "$DEPLOYMENT_TOKEN" \
  --yes 2>&1

echo ""
echo "✅ Site is OFFLINE. All routes now serve the offline page."
echo "   URL: https://notes.bhaumikkaji.com"
echo ""
echo "To restore: rebuild and redeploy the full site."
