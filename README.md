📍 Antalya Tarihi Yerler — Yakındaki Yer Bulucu

Antalya’daki tarihi mekanları Supabase (PostgreSQL + PostGIS) ve Next.js 14 kullanarak harita üzerinde gösteren, mesafe hesaplayan ve kullanıcı konumuna göre en yakın yerleri listeleyen modern bir GIS uygulaması.

🌐 Demo: https://antalya-tarih1.vercel.app/

🗂️ Veritabanı: Supabase
🗺️ Harita: Leaflet + React-Leaflet
🎨 Arayüz: Next.js + Tailwind CSS

🧭 Özellikler

Kullanıcı konumu tespiti

Harita üzerinde marker ve popup gösterimi

Supabase RPC ile yarıçap bazlı yakınlık sorgusu

PostGIS ST_Distance ve ST_DWithin fonksiyonları

Görselli mekan kartları

Google Maps rota bağlantısı

Koyu tema desteği

Mobil uyumlu tasarım

🛠️ Teknolojiler
Katman	Teknoloji
Veritabanı	PostgreSQL + PostGIS (Supabase)
Backend	Supabase RPC Functions
Frontend	Next.js 14 + Tailwind
Harita	Leaflet / React-Leaflet
Güvenlik	RLS (isteğe bağlı)
📁 Proje Yapısı
antalya-tarih/
│
├── supabase/
│   └── migrations/
│       ├── 202411240001_init.sql
│       ├── 202411240002_seed_tarihi_yerler.sql
│       ├── 202411240003_rpc_yakindaki_yerler.sql
│       └── 202411240004_add_images.sql
│
└── frontend/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/
    │   └── Map.tsx
    ├── lib/
    │   └── supabase.ts
    ├── public/
    ├── package.json
    └── tsconfig.json

🗄️ Supabase Veri Modeli
PostGIS Uzantısı
CREATE EXTENSION IF NOT EXISTS postgis;

Tablo Yapısı
CREATE TABLE tarihi_yerler (
  id SERIAL PRIMARY KEY,
  ad TEXT,
  aciklama TEXT,
  kategori TEXT,
  gorsel_url TEXT,
  geom GEOGRAPHY(Point, 4326)
);

CREATE INDEX idx_tarihi_geom ON tarihi_yerler USING GIST (geom);

🧠 RPC Fonksiyonu (yakindaki_yerler)
create or replace function yakindaki_yerler(
  user_lat float,
  user_lon float,
  radius float default 5000
)
returns table (
  id int,
  ad text,
  kategori text,
  lat float,
  lon float,
  gorsel_url text,
  mesafe_m float
)
as $$
  SELECT 
    id,
    ad,
    kategori,
    ST_Y(geom::geometry) as lat,
    ST_X(geom::geometry) as lon,
    gorsel_url,
    ST_Distance(
      geom,
      ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography
    ) as mesafe_m
  FROM tarihi_yerler
  WHERE ST_DWithin(
    geom,
    ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography,
    radius
  )
  ORDER BY mesafe_m ASC;
$$ language sql stable;

RPC Çağrısı (Frontend)
const { data } = await supabase.rpc("yakindaki_yerler", {
  user_lat: 36.8841,
  user_lon: 30.7054,
  radius: 6000,
});

⚙️ Kurulum
1) Repo’yu klonlayın
git clone https://github.com/suleymanssardogan/antalya-tarih.git
cd antalya-tarih

2) Supabase’i bağlayın ve migrasyonları çalıştırın
supabase link --project-ref <ref_code>
supabase db push

3) Frontend bağımlılıkları
cd frontend
npm install

4) Ortam değişkenleri (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://<proje>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>

5) Geliştirme
npm run dev
