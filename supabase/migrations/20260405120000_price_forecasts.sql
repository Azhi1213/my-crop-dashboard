-- Run in Supabase SQL Editor (or via CLI) once to create and seed crop price forecasts.
-- Matches CROP PRICE DATA.docx / app embedded fallback.

create table if not exists public.price_forecasts (
  id bigint generated always as identity primary key,
  year integer not null,
  month text not null,
  corn_white double precision not null,
  corn_yellow double precision not null,
  rice_fancy double precision not null,
  rice_other double precision not null,
  unique (year, month)
);

alter table public.price_forecasts enable row level security;

create policy "Allow anon read price_forecasts"
  on public.price_forecasts
  for select
  to anon, authenticated
  using (true);

-- Seed (36 rows: 2026–2028)
insert into public.price_forecasts (year, month, corn_white, corn_yellow, rice_fancy, rice_other) values
  (2026, 'January', 17.392251, 16.813207, 18.712211, 17.763376),
  (2026, 'February', 18.365217, 17.855983, 19.335521, 18.322656),
  (2026, 'March', 19.12896, 18.367113, 20.065234, 18.810585),
  (2026, 'April', 19.505476, 18.759517, 20.360768, 19.281987),
  (2026, 'May', 18.630631, 18.054585, 20.199005, 19.02364),
  (2026, 'June', 17.766734, 17.183269, 20.115631, 18.933412),
  (2026, 'July', 16.408729, 16.156589, 19.617338, 18.520088),
  (2026, 'August', 15.060916, 14.921654, 18.641628, 17.742431),
  (2026, 'September', 14.507927, 14.18531, 18.423302, 17.477009),
  (2026, 'October', 14.491734, 14.291533, 18.211551, 17.324805),
  (2026, 'November', 15.082816, 14.743253, 18.308135, 17.472346),
  (2026, 'December', 16.504705, 16.116589, 19.306423, 18.359761),
  (2027, 'January', 17.18187, 16.740596, 19.430074, 18.423356),
  (2027, 'February', 18.1407, 17.622082, 19.781839, 18.755069),
  (2027, 'March', 18.838514, 18.201961, 20.186611, 19.076398),
  (2027, 'April', 19.215084, 18.575196, 20.619619, 19.404939),
  (2027, 'May', 18.54091, 17.846124, 20.385183, 19.216613),
  (2027, 'June', 17.968739, 17.191844, 20.222859, 18.991967),
  (2027, 'July', 16.556511, 16.114055, 19.661589, 18.517865),
  (2027, 'August', 15.430809, 15.04786, 18.636206, 17.809214),
  (2027, 'September', 14.827754, 14.647096, 18.450605, 17.458945),
  (2027, 'October', 14.766936, 14.525169, 17.999048, 17.380577),
  (2027, 'November', 15.192519, 14.858449, 18.306868, 17.430463),
  (2027, 'December', 16.581138, 16.179803, 19.297501, 18.45568),
  (2028, 'January', 17.196748, 16.872514, 19.459757, 18.329451),
  (2028, 'February', 18.062251, 17.554517, 19.792247, 18.632411),
  (2028, 'March', 18.588232, 17.88686, 20.167098, 19.083365),
  (2028, 'April', 19.004913, 18.305536, 20.615234, 19.474516),
  (2028, 'May', 18.553567, 17.888173, 20.320954, 19.217234),
  (2028, 'June', 17.576649, 17.150564, 20.225082, 19.062953),
  (2028, 'July', 16.658126, 16.258288, 19.544735, 18.491688),
  (2028, 'August', 15.430838, 15.304672, 18.657896, 17.754083),
  (2028, 'September', 14.94202, 14.699087, 18.33669, 17.455134),
  (2028, 'October', 14.978134, 14.692802, 18.144163, 17.289534),
  (2028, 'November', 15.338936, 14.882581, 18.367114, 17.551124),
  (2028, 'December', 16.494218, 16.118313, 19.289481, 18.286411)
on conflict (year, month) do update set
  corn_white = excluded.corn_white,
  corn_yellow = excluded.corn_yellow,
  rice_fancy = excluded.rice_fancy,
  rice_other = excluded.rice_other;
