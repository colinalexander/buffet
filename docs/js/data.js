import { sortByTimestampDesc } from "./core.js";

const INDEX_URL = "data/index.json";

let cachedIndex = null;
const recordCache = new Map();

export async function loadIndex() {
  if (cachedIndex) {
    return cachedIndex;
  }
  const response = await fetch(INDEX_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load ${INDEX_URL}: ${response.status}`);
  }
  const data = await response.json();
  const records = Array.isArray(data.records) ? data.records : [];
  const groups = Array.isArray(data.groups) ? data.groups : [];
  cachedIndex = {
    generated_at: data.generated_at,
    records: sortByTimestampDesc(records),
    groups,
  };
  return cachedIndex;
}

export async function fetchRecordByPath(path) {
  if (!path) {
    return null;
  }
  if (recordCache.has(path)) {
    return recordCache.get(path);
  }
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load record ${path}: ${response.status}`);
  }
  const data = await response.json();
  recordCache.set(path, data);
  return data;
}

async function withConcurrencyLimit(items, limit, fn) {
  const queue = [...items];
  const results = [];
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      results.push(await fn(item));
    }
  });
  await Promise.all(workers);
  return results;
}

export async function loadAllRecords(recordMetas, { concurrency = 8 } = {}) {
  return withConcurrencyLimit(recordMetas, concurrency, async (meta) => {
    const data = await fetchRecordByPath(meta.path);
    return { meta, data };
  });
}
