import process from "node:process";
import XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function monthFromAny(value) {
  if (value == null || value === "") return null;
  const s = String(value).trim();
  const n = Number(s);
  if (Number.isFinite(n) && MONTHS[n - 1]) return MONTHS[n - 1];
  return MONTHS.find((m) => m.toLowerCase().startsWith(s.toLowerCase())) ?? null;
}

function numberOrNull(value) {
  if (value == null || value === "") return null;
  const n = Number(String(value).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : null;
}

function cropFieldFromLabel(label) {
  const v = String(label ?? "").toLowerCase().replace(/\s+/g, " ").trim();
  if (v.includes("corn") && v.includes("yellow")) return "corn_yellow";
  if (v.includes("palay") && v.includes("other")) return "rice_other";
  return null;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { file: null, table: "price_forecasts" };
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--file") opts.file = args[i + 1];
    if (args[i] === "--table") opts.table = args[i + 1];
  }
  if (!opts.file) throw new Error("Missing --file path.");
  return opts;
}

function rowsFromPivot(rawRows) {
  const map = new Map();
  let currentCropField = null;
  for (const row of rawRows) {
    const month = monthFromAny(row._1 ?? row.month);
    if (!month) continue;
    const rowCropField = cropFieldFromLabel(row[""] ?? row.crop);
    if (rowCropField) currentCropField = rowCropField;
    if (!currentCropField) continue;

    for (const [k, v] of Object.entries(row)) {
      if (!/^\d{4}$/.test(String(k))) continue;
      const year = Number(k);
      const val = numberOrNull(v);
      if (!Number.isInteger(year) || val == null) continue;
      const key = `${year}-${month}`;
      const base = map.get(key) ?? {
        year,
        month,
        corn_white: null,
        corn_yellow: null,
        rice_fancy: null,
        rice_other: null,
      };
      base[currentCropField] = val;
      map.set(key, base);
    }
  }
  return [...map.values()];
}

async function main() {
  const { file, table } = parseArgs();
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing VITE_SUPABASE_URL/SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");

  const wb = XLSX.readFile(file);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rawRows = XLSX.utils.sheet_to_json(ws, { defval: null });
  const rows = rowsFromPivot(rawRows)
    .filter((r) => r.year >= 2010 && r.year <= 2025)
    .map((r) => ({
      ...r,
      // Keep required DB columns populated even when source file only contains two crops.
      corn_white: r.corn_white ?? r.corn_yellow ?? 0,
      rice_fancy: r.rice_fancy ?? r.rice_other ?? 0,
    }));
  if (!rows.length) throw new Error("No rows parsed for 2010-2025.");

  console.log(`Prepared ${rows.length} rows.`);
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "year,month" });
  if (error) throw new Error(error.message);
  console.log(`Upsert complete to ${table}.`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
