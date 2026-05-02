# Kill Switch — Emergency Site Takedown

> One-command emergency shutdown for the live site. Run this if you ever need to take `notes.bhaumikkaji.com` offline immediately.

## Quick Takedown

```bash
# From the project root
bash scripts/kill-switch.sh
```

This will:
1. Build a minimal "offline" page
2. Deploy it to production, overwriting the live site
3. The site will show a generic "Temporarily unavailable" message

## What It Does

The script creates a `dist/` folder containing only:
- `index.html` — a single offline page with no identifying info
- `staticwebapp.config.json` — routes all paths to that page

Everything else (articles, images, audio, analytics) is removed from the deployed site.

## Restore

To bring the site back, rebuild and redeploy normally:

```bash
npm run build
swa deploy dist --env production --app-name swa-bhaumik-notes --resource-group rg-bhaumik-notes --deployment-token "$SWA_CLI_DEPLOYMENT_TOKEN"
```

## Requirements

- Azure CLI authenticated (`az account show` works)
- SWA CLI installed (`swa --version`)
- `SWA_CLI_DEPLOYMENT_TOKEN` exported or present in `.env`

## When to Use

- Security incident or data leak suspicion
- Legal or compliance requirement
- Personal safety concern
- Any situation where you need the site gone *now*

**Do not use for routine maintenance.** This is an emergency tool.
