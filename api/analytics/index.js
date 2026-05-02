const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

const account = process.env.TABLE_STORAGE_ACCOUNT || "stbhaumiknotes";
const key = process.env.TABLE_STORAGE_KEY;
const tableName = "analytics";

let client;
if (key) {
  client = new TableClient(
    `https://${account}.table.core.windows.net`,
    tableName,
    new AzureNamedKeyCredential(account, key)
  );
} else {
  const connectionString = process.env.AzureWebJobsStorage;
  if (connectionString) {
    client = TableClient.fromConnectionString(connectionString, tableName);
  }
}

async function ensureTable() {
  try { await client.createTable(); } catch (e) {}
}

function getToday() { return new Date().toISOString().slice(0, 10); }
function getMonth() { return new Date().toISOString().slice(0, 7); }
function getWeek() { 
  const d = new Date();
  const w = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / (7 * 24 * 60 * 60 * 1000));
  return `${d.getFullYear()}-W${String(w).padStart(2, '0')}`;
}

function checkAuth(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Basic ')) return false;
  const creds = Buffer.from(auth.slice(6), 'base64').toString();
  const [user, pass] = creds.split(':');
  return user === 'admin' && pass === process.env.ANALYTICS_PASSWORD;
}

module.exports = async function (context, req) {
  await ensureTable();
  const slug = req.body?.slug || req.query?.slug || 'site';
  const today = getToday();
  const month = getMonth();

  if (req.method === 'POST') {
    const eventType = req.body?.event || 'pageview';
    const metadata = req.body?.metadata || {};
    const referrer = req.headers.referer || '';
    const referrerDomain = referrer ? (() => { try { return new URL(referrer).hostname; } catch(e) { return 'unknown'; } })() : 'direct';
    const country = req.headers['cf-ipcountry'] || req.headers['x-country'] || 'unknown';
    const sessionId = req.body?.sessionId || 'anon';
    const timestamp = new Date().toISOString();

    // Store event
    await client.createEntity({
      partitionKey: slug,
      rowKey: `${eventType}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      eventType,
      sessionId,
      referrerDomain,
      country,
      timestamp,
      viewDate: today,
      viewMonth: month,
      ...metadata,
    });

    // Increment counters
    const counters = [
      { pk: 'daily', rk: `${slug}:${today}:${eventType}`, field: 'count', slug, date: today, eventType },
      { pk: 'monthly', rk: `${slug}:${month}:${eventType}`, field: 'count', slug, month, eventType },
      { pk: 'totals', rk: `${slug}:${eventType}`, field: 'total', slug, eventType },
    ];

    for (const counter of counters) {
      try {
        const existing = await client.getEntity(counter.pk, counter.rk);
        await client.updateEntity({
          partitionKey: counter.pk,
          rowKey: counter.rk,
          [counter.field]: (existing[counter.field] || 0) + 1,
          ...counter,
        });
      } catch (e) {
        await client.createEntity({
          partitionKey: counter.pk,
          rowKey: counter.rk,
          [counter.field]: 1,
          ...counter,
        });
      }
    }

    context.res = {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
    return;
  }

  if (req.method === 'OPTIONS') {
    context.res = {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
    return;
  }

  if (req.method === 'GET') {
    if (!checkAuth(req)) {
      context.res = {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Analytics"',
          'Content-Type': 'application/json',
        },
        body: { error: 'Authentication required' },
      };
      return;
    }

    const format = req.query?.format || 'json';

    // Aggregate all data
    const eventTypes = {};
    const articleEvents = {};
    const dailyEvents = {};
    const monthlyEvents = {};
    const referrerTotals = {};
    const countryTotals = {};
    const sessionEvents = {}; // For engagement tracking
    const timeOnPage = []; // For avg time

    // Query all events (limit to recent for performance)
    try {
      const entities = client.listEntities();
      let count = 0;
      for await (const entity of entities) {
        if (count++ > 5000) break; // Safety limit
        if (entity.partitionKey === 'daily' || entity.partitionKey === 'monthly' || entity.partitionKey === 'totals') continue;

        const eventType = entity.eventType || 'pageview';
        const slug = entity.partitionKey;
        const sessionId = entity.sessionId || 'anon';
        const timestamp = entity.timestamp;

        // Global event counts
        eventTypes[eventType] = (eventTypes[eventType] || 0) + 1;

        // Per-article events
        if (!articleEvents[slug]) articleEvents[slug] = {};
        articleEvents[slug][eventType] = (articleEvents[slug][eventType] || 0) + 1;

        // Referrers
        if (entity.referrerDomain) {
          referrerTotals[entity.referrerDomain] = (referrerTotals[entity.referrerDomain] || 0) + 1;
        }

        // Countries
        if (entity.country) {
          countryTotals[entity.country] = (countryTotals[entity.country] || 0) + 1;
        }

        // Session tracking
        if (!sessionEvents[sessionId]) sessionEvents[sessionId] = [];
        sessionEvents[sessionId].push({
          slug,
          eventType,
          timestamp,
          metadata: Object.keys(entity).filter(k => !['partitionKey','rowKey','timestamp','etag','odata.etag'].includes(k)),
        });

        // Time on page (if duration is in metadata)
        if (entity.duration) {
          timeOnPage.push(parseInt(entity.duration) || 0);
        }
      }
    } catch (e) {
      // No data
    }

    // Query daily aggregates for trends
    try {
      const dailyEntities = client.listEntities({
        queryOptions: { filter: `PartitionKey eq 'daily'` }
      });
      for await (const entity of dailyEntities) {
        const date = entity.date;
        const eventType = entity.eventType;
        const count = entity.count || 0;
        if (!dailyEvents[date]) dailyEvents[date] = {};
        dailyEvents[date][eventType] = (dailyEvents[date][eventType] || 0) + count;
      }
    } catch (e) {}

    // Calculate engagement metrics
    const totalSessions = Object.keys(sessionEvents).length;
    const avgSessionEvents = totalSessions > 0 ? Math.round(Object.values(sessionEvents).reduce((a, evts) => a + evts.length, 0) / totalSessions) : 0;
    const avgTimeOnPage = timeOnPage.length > 0 ? Math.round(timeOnPage.reduce((a, b) => a + b, 0) / timeOnPage.length) : 0;

    // Funnel metrics
    const pageViews = eventTypes.pageview || 0;
    const audioPlays = eventTypes.audio_play || 0;
    const tocClicks = eventTypes.toc_click || 0;
    const scroll75 = eventTypes.scroll_75 || 0;
    const reactionVotes = eventTypes.reaction_vote || 0;
    const resourceClicks = eventTypes.resource_click || 0;
    const footerClicks = eventTypes.footer_click || 0;
    const siteExits = eventTypes.site_exit || 0;

    const data = {
      today,
      overview: {
        totalPageViews: pageViews,
        totalSessions: totalSessions,
        avgSessionEvents,
        avgTimeOnPageSeconds: avgTimeOnPage,
        bounceRate: pageViews > 0 ? Math.round((pageViews - (scroll75 || 0)) / pageViews * 100) : 0,
      },
      funnel: {
        pageViews,
        audioPlays,
        tocClicks,
        scroll75,
        reactionVotes,
        resourceClicks,
        footerClicks,
        siteExits,
      },
      eventTypes,
      articleEvents,
      dailyEvents,
      referrerTotals,
      countryTotals,
      sessionEvents: Object.keys(sessionEvents).length > 10 
        ? { sample: Object.fromEntries(Object.entries(sessionEvents).slice(0, 5)), total: totalSessions }
        : sessionEvents,
    };

    if (format === 'html') {
      // Generate enhanced HTML dashboard
      const articlesHtml = Object.entries(articleEvents)
        .sort((a, b) => {
          const aViews = a[1].pageview || 0;
          const bViews = b[1].pageview || 0;
          return bViews - aViews;
        })
        .map(([slug, events]) => {
          const views = events.pageview || 0;
          const audio = events.audio_play || 0;
          const scroll = events.scroll_75 || 0;
          const toc = events.toc_click || 0;
          const react = events.reaction_vote || 0;
          const completion = views > 0 ? Math.round((scroll / views) * 100) : 0;
          return `
            <tr>
              <td><a href="/notes/${slug}/">${slug}</a></td>
              <td style="text-align:right">${views.toLocaleString()}</td>
              <td style="text-align:right">${audio.toLocaleString()}</td>
              <td style="text-align:right">${toc.toLocaleString()}</td>
              <td style="text-align:right">${scroll.toLocaleString()}</td>
              <td style="text-align:right">${completion}%</td>
              <td style="text-align:right">${react.toLocaleString()}</td>
            </tr>`;
        }).join('');

      const eventRows = Object.entries(eventTypes)
        .sort((a, b) => b[1] - a[1])
        .map(([type, count]) => `
          <tr><td>${type.replace(/_/g, ' ')}</td><td style="text-align:right">${count.toLocaleString()}</td></tr>
        `).join('');

      const daysHtml = Object.entries(dailyEvents)
        .sort()
        .slice(-14)
        .map(([date, events]) => {
          const total = Object.values(events).reduce((a, b) => a + b, 0);
          return `<tr><td>${date}</td><td style="text-align:right">${total.toLocaleString()}</td></tr>`;
        }).join('');

      const referrersHtml = Object.entries(referrerTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([ref, count]) => `
          <tr><td>${ref}</td><td style="text-align:right">${count.toLocaleString()}</td></tr>
        `).join('');

      context.res = {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
        body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Notes Analytics</title>
  <style>
    body { font-family: -apple-system, system-ui, sans-serif; max-width: 1200px; margin: 40px auto; padding: 0 20px; background: #0a0a0a; color: #e0e0e0; }
    h1 { font-size: 1.5rem; margin-bottom: 8px; }
    .subtitle { color: #888; font-size: 0.85rem; margin-bottom: 32px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 32px; }
    .stat { background: #1a1a1a; border-radius: 8px; padding: 20px; }
    .stat h3 { margin: 0 0 12px 0; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #888; }
    .big { font-size: 1.8rem; font-weight: 600; color: #fff; }
    .stat .sub { font-size: 0.75rem; color: #888; margin-top: 4px; }
    .green { color: #4ade80; }
    .yellow { color: #facc15; }
    .red { color: #f87171; }
    table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    th { text-align: left; padding: 10px 0; border-bottom: 1px solid #333; color: #888; font-weight: 500; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.03em; }
    td { padding: 8px 0; border-bottom: 1px solid #222; }
    a { color: #7c9cff; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .section { background: #1a1a1a; border-radius: 8px; padding: 24px; margin-bottom: 24px; }
    .section h2 { margin: 0 0 16px 0; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: #aaa; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    @media (max-width: 768px) { .two-col { grid-template-columns: 1fr; } .grid { grid-template-columns: repeat(2, 1fr); } }
    progress { width: 100%; height: 4px; border-radius: 2px; appearance: none; }
    progress::-webkit-progress-bar { background: #333; border-radius: 2px; }
    progress::-webkit-progress-value { background: #7c9cff; border-radius: 2px; }
    .funnel { display: flex; flex-direction: column; gap: 12px; }
    .funnel-row { display: flex; align-items: center; gap: 12px; }
    .funnel-label { min-width: 140px; font-size: 0.8rem; }
    .funnel-bar { flex: 1; }
    .funnel-val { min-width: 60px; text-align: right; font-weight: 600; }
  </style>
</head>
<body>
  <h1>📊 Bhaumik's Notes — Analytics</h1>
  <p class="subtitle">Dashboard for notes.bhaumikkaji.com · Updated ${new Date().toLocaleString()}</p>

  <div class="grid">
    <div class="stat">
      <h3>Page Views</h3>
      <div class="big">${data.overview.totalPageViews.toLocaleString()}</div>
    </div>
    <div class="stat">
      <h3>Sessions</h3>
      <div class="big">${data.overview.totalSessions.toLocaleString()}</div>
    </div>
    <div class="stat">
      <h3>Avg Time on Page</h3>
      <div class="big">${Math.round(data.overview.avgTimeOnPageSeconds / 60)}m ${data.overview.avgTimeOnPageSeconds % 60}s</div>
    </div>
    <div class="stat">
      <h3>Bounce Rate</h3>
      <div class="big ${data.overview.bounceRate > 60 ? 'red' : data.overview.bounceRate > 40 ? 'yellow' : 'green'}">${data.overview.bounceRate}%</div>
    </div>
    <div class="stat">
      <h3>Audio Plays</h3>
      <div class="big">${(data.funnel.audioPlays || 0).toLocaleString()}</div>
      <div class="sub">${data.funnel.pageViews > 0 ? Math.round((data.funnel.audioPlays / data.funnel.pageViews) * 100) : 0}% of viewers</div>
    </div>
    <div class="stat">
      <h3>Reactions</h3>
      <div class="big">${(data.funnel.reactionVotes || 0).toLocaleString()}</div>
      <div class="sub">${data.funnel.pageViews > 0 ? Math.round((data.funnel.reactionVotes / data.funnel.pageViews) * 100) : 0}% engagement</div>
    </div>
  </div>

  <div class="section">
    <h2>📈 Funnel — User Journey</h2>
    <div class="funnel">
      <div class="funnel-row">
        <div class="funnel-label">Page Views</div>
        <div class="funnel-bar"><progress value="${data.funnel.pageViews}" max="${data.funnel.pageViews || 1}"></progress></div>
        <div class="funnel-val">${data.funnel.pageViews}</div>
      </div>
      <div class="funnel-row">
        <div class="funnel-label">TOC Clicked</div>
        <div class="funnel-bar"><progress value="${data.funnel.tocClicks}" max="${data.funnel.pageViews || 1}"></progress></div>
        <div class="funnel-val">${data.funnel.tocClicks} (${data.funnel.pageViews > 0 ? Math.round((data.funnel.tocClicks / data.funnel.pageViews) * 100) : 0}%)</div>
      </div>
      <div class="funnel-row">
        <div class="funnel-label">Audio Played</div>
        <div class="funnel-bar"><progress value="${data.funnel.audioPlays}" max="${data.funnel.pageViews || 1}"></progress></div>
        <div class="funnel-val">${data.funnel.audioPlays} (${data.funnel.pageViews > 0 ? Math.round((data.funnel.audioPlays / data.funnel.pageViews) * 100) : 0}%)</div>
      </div>
      <div class="funnel-row">
        <div class="funnel-label">Scrolled 75%</div>
        <div class="funnel-bar"><progress value="${data.funnel.scroll75}" max="${data.funnel.pageViews || 1}"></progress></div>
        <div class="funnel-val">${data.funnel.scroll75} (${data.funnel.pageViews > 0 ? Math.round((data.funnel.scroll75 / data.funnel.pageViews) * 100) : 0}%)</div>
      </div>
      <div class="funnel-row">
        <div class="funnel-label">Reactions</div>
        <div class="funnel-bar"><progress value="${data.funnel.reactionVotes}" max="${data.funnel.pageViews || 1}"></progress></div>
        <div class="funnel-val">${data.funnel.reactionVotes} (${data.funnel.pageViews > 0 ? Math.round((data.funnel.reactionVotes / data.funnel.pageViews) * 100) : 0}%)</div>
      </div>
      <div class="funnel-row">
        <div class="funnel-label">Site Exits</div>
        <div class="funnel-bar"><progress value="${data.funnel.siteExits}" max="${data.funnel.pageViews || 1}"></progress></div>
        <div class="funnel-val">${data.funnel.siteExits}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>📝 Articles Performance</h2>
    <table>
      <tr>
        <th>Article</th>
        <th style="text-align:right">Views</th>
        <th style="text-align:right">Audio</th>
        <th style="text-align:right">TOC</th>
        <th style="text-align:right">75% Scroll</th>
        <th style="text-align:right">Completion</th>
        <th style="text-align:right">Reactions</th>
      </tr>
      ${articlesHtml || '<tr><td colspan="7">No data yet</td></tr>'}
    </table>
  </div>

  <div class="two-col">
    <div class="section">
      <h2>📅 Daily Traffic (14 days)</h2>
      <table>
        <tr><th>Date</th><th style="text-align:right">Events</th></tr>
        ${daysHtml || '<tr><td colspan="2">No data yet</td></tr>'}
      </table>
    </div>
    <div class="section">
      <h2>🔗 Top Referrers</h2>
      <table>
        <tr><th>Source</th><th style="text-align:right">Count</th></tr>
        ${referrersHtml || '<tr><td colspan="2">No data yet</td></tr>'}
      </table>
    </div>
  </div>

  <div class="section">
    <h2>🎯 Event Breakdown</h2>
    <table>
      <tr><th>Event Type</th><th style="text-align:right">Count</th></tr>
      ${eventRows || '<tr><td colspan="2">No data yet</td></tr>'}
    </table>
  </div>

  <p style="color: #555; font-size: 0.75rem; margin-top: 40px;">
    Privacy-focused: no IP addresses, no cookies, no personal identifiers tracked.
    Session IDs are random hashes, not tied to users.
  </p>
</body>
</html>`,
      };
      return;
    }

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
      body: data,
    };
    return;
  }

  context.res = { status: 405, body: { error: 'Method not allowed' } };
};
