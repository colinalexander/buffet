export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

export function uniq(values) {
  return Array.from(new Set(values.filter((value) => value !== undefined && value !== null))).sort();
}

export function truncate(value, maxLength) {
  const text = String(value ?? "");
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 3)}...`;
}

export function formatIsoDate(isoString) {
  if (!isoString) {
    return "";
  }
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return String(isoString);
  }
  return date.toISOString().replace(".000Z", "Z");
}

export function formatShortDate(isoString) {
  if (!isoString) {
    return "";
  }
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return String(isoString);
  }
  return date.toISOString().slice(0, 10);
}

export function sortByTimestampDesc(items) {
  return [...items].sort((a, b) => String(b.timestamp ?? "").localeCompare(String(a.timestamp ?? "")));
}

export function groupBy(items, keyFn) {
  const map = new Map();
  items.forEach((item) => {
    const key = keyFn(item);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(item);
  });
  return map;
}

export function sum(values) {
  return values.reduce((acc, value) => acc + (Number(value) || 0), 0);
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

export function toCsv(rows) {
  const escape = (value) => {
    const text = String(value ?? "");
    if (/[",\n]/.test(text)) {
      return `"${text.replaceAll("\"", "\"\"")}"`;
    }
    return text;
  };

  return rows.map((row) => row.map(escape).join(",")).join("\n");
}

export function debounce(fn, delayMs) {
  let handle = null;
  return (...args) => {
    if (handle) {
      clearTimeout(handle);
    }
    handle = setTimeout(() => fn(...args), delayMs);
  };
}

