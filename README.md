# antalya-tarih


📍 Antalya Tarihi Yerler – Yakındaki Yer Bulucu

Modern bir Coğrafi Bilgi Sistemi (GIS) uygulaması.
Kullanıcı konumuna en yakın Antalya’daki tarihi yerleri bulmak için Supabase (PostgreSQL + PostGIS) ve Next.js + Leaflet kullanır.

Bu proje:

🗺️ Gerçek coğrafi veriler

📡 PostGIS mesafe & yakınlık sorguları

🧭 Kullanıcı konum tespiti

🧩 Supabase RPC fonksiyonları

🎨 Next.js + Leaflet harita arayüzü
içerir.

🚀 Teknolojiler
Katman	Teknoloji
🗄️ Database	PostgreSQL + PostGIS (Supabase)
📡 Backend Logic	Supabase RPC (SQL Fonksiyonları)
🎨 Frontend	Next.js 14 + Tailwind
🗺️ Harita	Leaflet / React-Leaflet
🔐 Güvenlik	RLS (Row Level Security)
📘 Proje Özeti

Bu uygulama, Antalya’daki 20+ tarihi yerin koordinatlarını kullanarak kullanıcının konumuna en yakın yerleri listeler.

Özellikler:

📍 Kullanıcı konumu belirleme (HTML Geolocation API)

🧭 En yakın yerleri listeleme

🔍 Mesafeye göre sıralama

🗺️ Harita üzerinde marker olarak gösterme

📡 Supabase RPC üzerinden hızlı mesafe hesaplama

🔒 RLS destekli güvenli veri yapısı

🗄️ Veritabanı Yapısı (Supabase)
📌 PostGIS’i aktifleştir:
CREATE EXTENSION IF NOT EXISTS postgis;

📌 Tablo: tarihi_yerler
CREATE TABLE tarihi_yerler (
  id SERIAL PRIMARY KEY,
  ad TEXT,
  aciklama TEXT,
  kategori TEXT,
  geom GEOGRAPHY(Point, 4326)
);

📌 Örnek Veri (Antalya - 20+ yer)

/supabase/migrations/insert_tarihi_yerler.sql dosyasında.

🧠 Yakındaki Yerler RPC Fonksiyonu

Supabase → SQL Editor → RPC:

create or replace function yakindaki_yerler(
  user_lat float,
  user_lon float,
  radius float
)
returns table (
  id int,
  ad text,
  kategori text,
  mesafe_m float
)
as $$
  SELECT 
    id, ad, kategori,
    ST_Distance(
      geom, 
      ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography
    ) AS mesafe_m
  FROM tarihi_yerler
  WHERE ST_DWithin(
    geom,
    ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography,
    radius
  )
  ORDER BY mesafe_m ASC;
$$ language sql stable;


Frontend bu fonksiyonu şöyle çağırır:

const { data } = await supabase.rpc("yakindaki_yerler", {
  user_lat: 36.8849,
  user_lon: 30.7012,
  radius: 2000,
});

🎨 Frontend (Next.js + Leaflet)
📁 Klasör Yapısı
/frontend
   ├── app/
   ├── components/Map.tsx
   ├── lib/supabase.ts
   ├── page.tsx
   └── package.json

/supabase
   └── migrations

🔧 Supabase Client (lib/supabase.ts)
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

🗺️ Harita Bileşeni (components/Map.tsx)

Bu bileşen:

Kullanıcının konumunu alır

Supabase RPC’den veri çeker

Leaflet üzerinde marker olarak gösterir

(Cursor’a yazdığında bu dosyayı tamamen otomatik yazdırabiliriz!)

⚙️ Kurulum
1) Repo’yu klonla
git clone https://github.com/suleymanssardogan/antalya-tarih.git
cd antalya-tarih

2) Supabase ortam değişkenleri (.env.local)
NEXT_PUBLIC_SUPABASE_URL=YOUR_URL_HERE
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_KEY_HERE

3) Frontend kurulum:
cd frontend
npm install
npm run dev

📸 Ekran Görüntüleri (Boş placeholder)

Aşağıya kendi ekran görüntülerini ekleyebilirsin:

![Ana harita ekranı](screenshots/map.png)
![Yakındaki yerler listesi](screenshots/list.png)

🧭 Yol Haritası

 Kategori filtreleme (cami/müze/antik kent)

 Mesafe slider (1km – 10km)

 Marker cluster

 Tarihi yer detay sayfası

 Kullanıcı kaydı + favoriler

👤 Geliştirici

Süleyman Sardoğan
Yazılım Mühendisliği • AI • Data • GIS • Supabase

🎉 Lisans

MIT – Herkes kullanabilir.
