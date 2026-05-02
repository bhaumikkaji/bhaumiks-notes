# Bhaumik's Notes — Deployment Reference

**Live Site:** https://notes.bhaumikkaji.com

## Deployment Method

Deployed via **Azure Static Web Apps CLI** (`swa`), not GitHub Actions.

```bash
# Build
npm run build

# Deploy to production
export SWA_CLI_DEPLOYMENT_TOKEN="b90808b3b1d94c5bbac22ab397f69117dd8f0cc44378002de80cd087c5d6509007-4e186680-42b8-4039-bc07-e7572997791d0101600015953d10"
swa deploy dist --env production --app-name swa-bhaumik-notes --resource-group rg-bhaumik-notes --deployment-token "$SWA_CLI_DEPLOYMENT_TOKEN"
```

Token source: `az staticwebapp secrets list --name swa-bhaumik-notes`

## Azure Resources

| Resource | Name | Type |
|---|---|---|
| Static Web App | swa-bhaumik-notes | Microsoft.Web/staticSites |
| Function App | func-bhaumik-notes | Microsoft.Web/sites |
| Storage Account | stbhaumiknotes | Microsoft.Storage/storageAccounts |
| Resource Group | rg-bhaumik-notes | — |

## Analytics Dashboard

**URL:** https://func-bhaumik-notes.azurewebsites.net/api/analytics?format=html
**Username:** `admin`
**Password:** `bknotes2026`

### JSON API
```bash
curl -H "Authorization: Basic YWRtaW46Ymtub3RlczIwMjY=" \
  https://func-bhaumik-notes.azurewebsites.net/api/analytics
```

### What's Tracked
Privacy-focused — no cookies, no IP addresses, no personal identifiers:

| Metric | Event Name |
|---|---|
| Page Views | `pageview` (3s engagement threshold) |
| TOC Clicks | `toc_click` |
| Audio Plays | `audio_play` |
| Scroll Depth | `scroll_25`, `scroll_50`, `scroll_75` |
| Time on Page | `time_heartbeat` (every 30s) |
| Resources | `resource_click` |
| Footer Clicks | `footer_click` |
| Site Exit | `site_exit` |
| Reactions | `reaction_vote` |

## Reactions API

**Endpoint:** `POST https://func-bhaumik-notes.azurewebsites.net/api/reactions?slug={article-slug}`
**Body:** `{"reaction": "good"}`
**Valid reactions:** thoughtful, relatable, good, loved-it, blew-mind

## Git Workflow

- **Main branch:** `main` — production code
- **Dev branch:** `judy/scaffold-astro-blog` — Judy works here
- Merge to `main` via fast-forward

## Kill Switch

Emergency takedown: `bash scripts/kill-switch.sh`

- Requires typing `"offline"` to confirm
- Replaces live site with generic offline page
- See `KILL-SWITCH.md` for full details
- **Never run without Bhaumik's explicit permission**

## Security Headers (via staticwebapp.config.json)

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Content-Security-Policy` — full CSP defined
- `Permissions-Policy` — restrictive defaults

## .gitignore Notes

These are intentionally gitignored:
- `DEPLOYMENT.md` — this file (contains credentials)
- `KILL-SWITCH.md` — emergency procedure
- `scripts/kill-switch.sh` — takedown script

Both kill-switch files are **force-committed** so they're in the repo despite gitignore.

## Telemetry Code Location

Privacy-focused analytics are inline in `src/layouts/NoteLayout.astro` — no external analytics library. Data goes to the Azure Function above.

---

*Last updated: 2026-05-02*
