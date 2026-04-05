import { supabase } from "./supabaseClient";

/** Canonical month order for sorting DB rows */
const MONTH_ORDER = Object.fromEntries(
  [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].map((m, i) => [m, i])
);

/**
 * Embedded fallback — matches CROP PRICE DATA (DOCX) / SARIMA forecasts.
 * Used when offline or Supabase is unavailable.
 */
export const FALLBACK_PRICE_DATA = [
  { year: 2026, month: "January", corn_white: 17.392251, corn_yellow: 16.813207, rice_fancy: 18.712211, rice_other: 17.763376 },
  { year: 2026, month: "February", corn_white: 18.365217, corn_yellow: 17.855983, rice_fancy: 19.335521, rice_other: 18.322656 },
  { year: 2026, month: "March", corn_white: 19.12896, corn_yellow: 18.367113, rice_fancy: 20.065234, rice_other: 18.810585 },
  { year: 2026, month: "April", corn_white: 19.505476, corn_yellow: 18.759517, rice_fancy: 20.360768, rice_other: 19.281987 },
  { year: 2026, month: "May", corn_white: 18.630631, corn_yellow: 18.054585, rice_fancy: 20.199005, rice_other: 19.02364 },
  { year: 2026, month: "June", corn_white: 17.766734, corn_yellow: 17.183269, rice_fancy: 20.115631, rice_other: 18.933412 },
  { year: 2026, month: "July", corn_white: 16.408729, corn_yellow: 16.156589, rice_fancy: 19.617338, rice_other: 18.520088 },
  { year: 2026, month: "August", corn_white: 15.060916, corn_yellow: 14.921654, rice_fancy: 18.641628, rice_other: 17.742431 },
  { year: 2026, month: "September", corn_white: 14.507927, corn_yellow: 14.18531, rice_fancy: 18.423302, rice_other: 17.477009 },
  { year: 2026, month: "October", corn_white: 14.491734, corn_yellow: 14.291533, rice_fancy: 18.211551, rice_other: 17.324805 },
  { year: 2026, month: "November", corn_white: 15.082816, corn_yellow: 14.743253, rice_fancy: 18.308135, rice_other: 17.472346 },
  { year: 2026, month: "December", corn_white: 16.504705, corn_yellow: 16.116589, rice_fancy: 19.306423, rice_other: 18.359761 },
  { year: 2027, month: "January", corn_white: 17.18187, corn_yellow: 16.740596, rice_fancy: 19.430074, rice_other: 18.423356 },
  { year: 2027, month: "February", corn_white: 18.1407, corn_yellow: 17.622082, rice_fancy: 19.781839, rice_other: 18.755069 },
  { year: 2027, month: "March", corn_white: 18.838514, corn_yellow: 18.201961, rice_fancy: 20.186611, rice_other: 19.076398 },
  { year: 2027, month: "April", corn_white: 19.215084, corn_yellow: 18.575196, rice_fancy: 20.619619, rice_other: 19.404939 },
  { year: 2027, month: "May", corn_white: 18.54091, corn_yellow: 17.846124, rice_fancy: 20.385183, rice_other: 19.216613 },
  { year: 2027, month: "June", corn_white: 17.968739, corn_yellow: 17.191844, rice_fancy: 20.222859, rice_other: 18.991967 },
  { year: 2027, month: "July", corn_white: 16.556511, corn_yellow: 16.114055, rice_fancy: 19.661589, rice_other: 18.517865 },
  { year: 2027, month: "August", corn_white: 15.430809, corn_yellow: 15.04786, rice_fancy: 18.636206, rice_other: 17.809214 },
  { year: 2027, month: "September", corn_white: 14.827754, corn_yellow: 14.647096, rice_fancy: 18.450605, rice_other: 17.458945 },
  { year: 2027, month: "October", corn_white: 14.766936, corn_yellow: 14.525169, rice_fancy: 17.999048, rice_other: 17.380577 },
  { year: 2027, month: "November", corn_white: 15.192519, corn_yellow: 14.858449, rice_fancy: 18.306868, rice_other: 17.430463 },
  { year: 2027, month: "December", corn_white: 16.581138, corn_yellow: 16.179803, rice_fancy: 19.297501, rice_other: 18.45568 },
  { year: 2028, month: "January", corn_white: 17.196748, corn_yellow: 16.872514, rice_fancy: 19.459757, rice_other: 18.329451 },
  { year: 2028, month: "February", corn_white: 18.062251, corn_yellow: 17.554517, rice_fancy: 19.792247, rice_other: 18.632411 },
  { year: 2028, month: "March", corn_white: 18.588232, corn_yellow: 17.88686, rice_fancy: 20.167098, rice_other: 19.083365 },
  { year: 2028, month: "April", corn_white: 19.004913, corn_yellow: 18.305536, rice_fancy: 20.615234, rice_other: 19.474516 },
  { year: 2028, month: "May", corn_white: 18.553567, corn_yellow: 17.888173, rice_fancy: 20.320954, rice_other: 19.217234 },
  { year: 2028, month: "June", corn_white: 17.576649, corn_yellow: 17.150564, rice_fancy: 20.225082, rice_other: 19.062953 },
  { year: 2028, month: "July", corn_white: 16.658126, corn_yellow: 16.258288, rice_fancy: 19.544735, rice_other: 18.491688 },
  { year: 2028, month: "August", corn_white: 15.430838, corn_yellow: 15.304672, rice_fancy: 18.657896, rice_other: 17.754083 },
  { year: 2028, month: "September", corn_white: 14.94202, corn_yellow: 14.699087, rice_fancy: 18.33669, rice_other: 17.455134 },
  { year: 2028, month: "October", corn_white: 14.978134, corn_yellow: 14.692802, rice_fancy: 18.144163, rice_other: 17.289534 },
  { year: 2028, month: "November", corn_white: 15.338936, corn_yellow: 14.882581, rice_fancy: 18.367114, rice_other: 17.551124 },
  { year: 2028, month: "December", corn_white: 16.494218, corn_yellow: 16.118313, rice_fancy: 19.289481, rice_other: 18.286411 },
];

function normalizeRows(rows) {
  return rows
    .map((r) => ({
      year: Number(r.year),
      month: String(r.month).trim(),
      corn_white: Number(r.corn_white),
      corn_yellow: Number(r.corn_yellow),
      rice_fancy: Number(r.rice_fancy),
      rice_other: Number(r.rice_other),
    }))
    .filter(
      (r) =>
        r.year &&
        r.month &&
        Number.isFinite(r.corn_white) &&
        Number.isFinite(r.corn_yellow) &&
        Number.isFinite(r.rice_fancy) &&
        Number.isFinite(r.rice_other)
    )
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return (MONTH_ORDER[a.month] ?? 0) - (MONTH_ORDER[b.month] ?? 0);
    });
}

/**
 * Loads monthly forecast rows from Supabase `price_forecasts` table.
 * @returns {{ data: typeof FALLBACK_PRICE_DATA, source: 'supabase'|'fallback', error: Error|null }}
 */
export async function fetchPriceForecasts() {
  const { data, error } = await supabase
    .from("price_forecasts")
    .select("year, month, corn_white, corn_yellow, rice_fancy, rice_other");

  if (error) {
    console.warn("[camprice] Supabase price_forecasts:", error.message);
    return { data: FALLBACK_PRICE_DATA, source: "fallback", error };
  }
  if (!data?.length) {
    return { data: FALLBACK_PRICE_DATA, source: "fallback", error: null };
  }
  const normalized = normalizeRows(data);
  if (!normalized.length) {
    return { data: FALLBACK_PRICE_DATA, source: "fallback", error: null };
  }
  return { data: normalized, source: "supabase", error: null };
}

export async function pingSupabase() {
  const { error } = await supabase.from("price_forecasts").select("id").limit(1);
  return { ok: !error, error };
}
