import { sortByTimestampDesc } from "./core.js";

const INDEX_URL = "data/index.json";
export const SHOW_ALL_EMISSIONS_STORAGE_KEY = "mandateos.viewer.showAllEmissions";

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

export function readShowAllEmissions({ defaultValue = false } = {}) {
  try {
    return window.localStorage.getItem(SHOW_ALL_EMISSIONS_STORAGE_KEY) === "1";
  } catch {
    return defaultValue;
  }
}

export function writeShowAllEmissions(value) {
  try {
    window.localStorage.setItem(SHOW_ALL_EMISSIONS_STORAGE_KEY, value ? "1" : "0");
  } catch {
    // ignore
  }
}

function buildGroupedMetas(emissions, groups) {
  const representativeByEmissionId = new Map();
  if (!Array.isArray(groups) || !groups.length) {
    return { records: [], representativeByEmissionId };
  }

  const recordById = new Map(emissions.map((record) => [String(record.record_id), record]));
  const grouped = [];

  groups.forEach((group) => {
    const emissionList = Array.isArray(group?.emissions) ? group.emissions : [];
    const representative = emissionList[0] || null;
    const representativeId = representative?.record_id ? String(representative.record_id) : null;
    const representativePath = group?.representative_path || representative?.path || null;
    if (!representativeId || !representativePath) {
      return;
    }

    const base = recordById.get(representativeId);
    const meta = base
      ? { ...base }
      : {
          path: representativePath,
          record_id: representativeId,
          timestamp: group?.last_timestamp || representative?.timestamp,
          mandate_id: group?.mandate_id,
          mandate_version: null,
          procedure_id: group?.procedure_id,
          procedure_version: null,
          outcome_type: group?.outcome_type,
          confidence_level: null,
          published_from: representative?.published_from,
          judgment_fingerprint: group?.fingerprint,
        };

    meta.path = representativePath;
    meta.timestamp = group?.last_timestamp || meta.timestamp;
    meta.group = group;
    if (!meta.judgment_fingerprint && group?.fingerprint) {
      meta.judgment_fingerprint = group.fingerprint;
    }

    grouped.push(meta);

    emissionList.forEach((emission) => {
      if (emission?.record_id) {
        representativeByEmissionId.set(String(emission.record_id), representativeId);
      }
    });
  });

  grouped.sort((a, b) => String(a.record_id ?? "").localeCompare(String(b.record_id ?? "")));
  grouped.sort((a, b) => String(b.timestamp ?? "").localeCompare(String(a.timestamp ?? "")));

  return { records: grouped, representativeByEmissionId };
}

export function getActiveDataset(index, { showAllEmissions } = {}) {
  const emissions = Array.isArray(index?.records) ? index.records : [];
  const groups = Array.isArray(index?.groups) ? index.groups : [];
  const resolvedShowAllEmissions =
    typeof showAllEmissions === "boolean" ? showAllEmissions : readShowAllEmissions({ defaultValue: false });

  if (resolvedShowAllEmissions || !groups.length) {
    return {
      mode: "emissions",
      showAllEmissions: true,
      records: emissions,
      allRecords: emissions,
      groups,
      representativeByEmissionId: new Map(),
    };
  }

  const { records, representativeByEmissionId } = buildGroupedMetas(emissions, groups);
  return {
    mode: "groups",
    showAllEmissions: false,
    records,
    allRecords: emissions,
    groups,
    representativeByEmissionId,
  };
}
