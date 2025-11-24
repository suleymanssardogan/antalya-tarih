📍 Antalya Tarihi Yerler — Yakındaki Yer Bulucu

Modern bir Coğrafi Bilgi Sistemi (GIS) uygulaması.
Kullanıcı konumuna en yakın Antalya’daki tarihi yerleri bulur, harita üzerinde gösterir, mesafe ölçer ve Google Haritalar üzerinden rota oluşturur.

🌐 Demo: https://antalya-tarih1.vercel.app/

🗂️ Veritabanı: Supabase (PostgreSQL + PostGIS)
🗺️ Frontend: Next.js 14 (App Router) + Leaflet

✨ Özellikler
📌 Coğrafi veri & harita özellikleri

20+ Antalya tarihi mekânı (eşsiz koordinatlar + görseller)

Leaflet üzerinde kullanıcı konumu, marker’lar, popup görseller

Yarıçap çemberi içinde filtreleme

📡 Supabase + PostGIS tarafı

tarihi_yerler tablosu (GEOGRAPHY Point)

GIST indeksli hızlı yakınlık sorgusu

RPC fonksiyonu: yakindaki_yerler

Mesafe hesaplama (ST_Distance)

Yarıçap içinde filtreleme (ST_DWithin)

🧭 Kullanıcı deneyimi

Konum izni reddedilse bile fallback (Antalya merkezi)

Mesafe sıralaması

Tarayıcıdan Google Maps rota açma

Koyu tema & responsive arayüz

🛠️ Teknolojiler
Backend

Supabase PostgreSQL

PostGIS (coğrafi fonksiyonlar)

Supabase RPC Functions

Frontend

Next.js 14 – App Router

React 18 + TypeScript

Leaflet & React-Leaflet

Tailwind CSS

Araçlar

Supabase CLI

GitHub + Vercel Deploy



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

🎨 Frontend – Harita Bileşeni
Konum alma → RPC gönderme → Harita render

Kullanıcı izni → navigator.geolocation

RPC fonksiyonu → Supabase çağrısı

Marker çizimi → Leaflet

Popup alanı → görsel + kategori + mesafe


⚙️ Kurulum
1️⃣ Repoyu klonla

git clone https://github.com/suleymanssardogan/antalya-tarih.git
cd antalya-tarih
