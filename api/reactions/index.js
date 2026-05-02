const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

// Table Storage setup
const account = process.env.TABLE_STORAGE_ACCOUNT || "stbhaumiknotes";
const key = process.env.TABLE_STORAGE_KEY;
const tableName = "reactions";

let client;
if (key) {
  client = new TableClient(
    `https://${account}.table.core.windows.net`,
    tableName,
    new AzureNamedKeyCredential(account, key)
  );
} else {
  // Fallback to connection string or managed identity
  const connectionString = process.env.AzureWebJobsStorage;
  if (connectionString) {
    client = TableClient.fromConnectionString(connectionString, tableName);
  }
}

// Ensure table exists
async function ensureTable() {
  try {
    await client.createTable();
  } catch (e) {
    // Table already exists
  }
}

// Simple hash for session identification
function hashSession(context) {
  const ip = context.req.headers["x-forwarded-for"] || "unknown";
  const ua = context.req.headers["user-agent"] || "unknown";
  return Buffer.from(`${ip}:${ua}`).toString("base64").slice(0, 20);
}

module.exports = async function (context, req) {
  await ensureTable();

  const slug = req.query.slug || (req.body && req.body.slug);
  if (!slug) {
    context.res = { status: 400, body: { error: "Missing slug" } };
    return;
  }

  const validReactions = ["thoughtful", "relatable", "good", "loved-it", "blew-mind"];
  const sessionHash = hashSession(context);

  // GET - return counts
  if (req.method === "GET") {
    const counts = {};
    const userVotes = {};

    try {
      const entities = client.listEntities({ queryOptions: { filter: `PartitionKey eq '${slug}'` } });
      for await (const entity of entities) {
        const reaction = entity.reaction;
        counts[reaction] = (counts[reaction] || 0) + (entity.count || 1);
        if (entity.rowKey.startsWith(sessionHash)) {
          userVotes[reaction] = true;
        }
      }
    } catch (e) {
      // No votes yet
    }

    context.res = {
      status: 200,
      body: {
        slug,
        counts,
        userVotes,
      },
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
    return;
  }

  // POST - toggle vote
  if (req.method === "POST") {
    const reaction = req.body && req.body.reaction;
    if (!reaction || !validReactions.includes(reaction)) {
      context.res = { status: 400, body: { error: "Invalid reaction" } };
      return;
    }

    const rowKey = `${sessionHash}:${reaction}`;

    try {
      // Check if user already voted
      const existing = await client.getEntity(slug, rowKey);
      // Vote exists, remove it (toggle off)
      await client.deleteEntity(slug, rowKey);
    } catch (e) {
      // Vote doesn't exist, add it (toggle on)
      await client.upsertEntity({
        partitionKey: slug,
        rowKey,
        reaction,
        count: 1,
        timestamp: new Date(),
      });
    }

    // Return updated counts
    const counts = {};
    const userVotes = {};
    const entities = client.listEntities({ queryOptions: { filter: `PartitionKey eq '${slug}'` } });
    for await (const entity of entities) {
      const r = entity.reaction;
      counts[r] = (counts[r] || 0) + (entity.count || 1);
      if (entity.rowKey.startsWith(sessionHash)) {
        userVotes[r] = true;
      }
    }

    context.res = {
      status: 200,
      body: {
        slug,
        counts,
        userVotes,
      },
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
    return;
  }

  // OPTIONS - CORS preflight
  if (req.method === "OPTIONS") {
    context.res = {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
    return;
  }

  context.res = { status: 405, body: { error: "Method not allowed" } };
};
