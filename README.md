<<<<<<< HEAD
# Yakındaki Tarihi Yerler

Antalya’daki tarihi noktaları Supabase (PostgreSQL + PostGIS) ve Next.js 14 (App Router) kullanarak listeleyen, harita üzerinde gösteren ve yol tarifi sunan tam yığın GIS uygulaması.

## İçindekiler
- [Özellikler](#özellikler)
- [Teknolojiler](#teknolojiler)
- [Proje Yapısı](#proje-yapısı)
- [Kurulum](#kurulum)
- [Supabase Migrasyonları](#supabase-migrasyonları)
- [RPC Fonksiyonu](#rpc-fonksiyonu)
- [Kullanım](#kullanım)
- [Geliştirme İpuçları](#geliştirme-ipuçları)

## Özellikler
- Supabase + PostGIS üzerinde `tarihi_yerler` tablosu ve 20 adet Antalya mekânı.
- `yakindaki_yerler` isimli RPC fonksiyonu ile yarıçap bazlı yakınlık sorgusu.
- Leaflet haritasında kullanıcı konumu, yarıçap çemberi, görselli marker popup’ları.
- Sağ panelde fotoğraflı sonuç listesi, mesafe bilgisi ve Google Haritalar yol tarifi linki.
- Konum izni reddedilse bile Antalya merkezi üzerinden sorgu çalıştırma.
- Tailwind CSS ile koyu tema, loading & error durumları.

## Teknolojiler
- **Supabase (PostgreSQL + PostGIS)**
- **Next.js 14 App Router**
- **React 18, TypeScript, Tailwind CSS**
- **Leaflet & React-Leaflet**

## Proje Yapısı
```
supabase/
  migrations/
    202411240001_init.sql          # PostGIS + tablo
    202411240002_seed_tarihi_yerler.sql
    202411240003_rpc_yakindaki_yerler.sql
    202411240004_add_images.sql    # Görsel URL güncellemeleri
frontend/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/Map.tsx
  lib/supabase.ts
  package.json
README.md
```

## Kurulum
1. **Supabase CLI**: [Kurulum rehberi](https://supabase.com/docs/guides/cli/getting-started).
2. Depoyu klonlayın ve dizine girin:
   ```bash
   git clone https://github.com/suleymanssardogan/antalya-tarih.git
   cd antalya-tarih
   ```
3. Supabase projesini bağlayın:
   ```bash
   supabase link --project-ref <proje_ref_kodu>
   ```
4. Migrasyonları gönderin:
   ```bash
   supabase db push
   ```
5. Frontend bağımlılıkları:
   ```bash
   cd frontend
   npm install
   ```
6. Ortam değişkenleri (`frontend/.env.local`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<proje_ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
   ```
7. Geliştirme sunucusu:
   ```bash
   npm run dev
   ```
   Uygulama `http://localhost:3000` adresinde.

## Supabase Migrasyonları
- `202411240001_init.sql`: PostGIS uzantısı + `tarihi_yerler` tablosu + GIST indeks.
- `202411240002_seed_tarihi_yerler.sql`: 20 adet tarihi mekan kaydı.
- `202411240003_rpc_yakindaki_yerler.sql`: RPC fonksiyonu, görsel URL dahil.
- `202411240004_add_images.sql`: `gorsel_url` kolonu ve Wikimedia görsel linkleri.

Migrasyonlar sırasıyla PostGIS’i etkinleştirir, tabloyu oluşturur, verileri ekler ve RPC fonksiyonunu hazırlayarak görsel destekli sonuçlar döndürür.

## RPC Fonksiyonu
```sql
yakindaki_yerler(lat float8, lon float8, radius float8 default 5000)
RETURNS (id, ad, kategori, lat, lon, gorsel_url, mesafe_m)
```
- `ST_DWithin` ile belirtilen yarıçap içindeki kayıtlar filtrelenir.
- `ST_Distance` ile metre cinsinden mesafe hesaplanır ve artan sırayla döner.
- Örnek çağrı:
  ```sql
  select * from yakindaki_yerler(36.8841, 30.7054, 8000);
  ```

## Kullanım
- Sayfa açıldığında geolokasyon izni istenir; reddedilirse Antalya merkezi kullanılır.
- Yarıçap girişini güncellemek ve “RPC Sorgusunu Yenile” butonuna basmak yeni Supabase sorgusu tetikler.
- Harita üzerindeki marker’a tıkladığınızda görsel, kategori ve mesafe bilgisi görünür.
- Liste kartlarındaki “Google Haritalar yol tarifi” bağlantısı ile tarayıcıdan rota açabilirsiniz.

## Geliştirme İpuçları
- Yeni migrasyon eklemek için `supabase migration new <ad>` kullanın.
- RLS aktifleştirecekseniz anonim anahtarın erişebileceği politikaları eklemeyi unutmayın.
- Harita stilleri için Tailwind teması `app/globals.css` üzerinden özelleştirilebilir.
- Paket güncellemeleri sonrası `npm run lint` ile TS/ESLint kontrollerini çalıştırın.

Keyifli çalışmalar! 🗺️



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
>>>>>>> 3e39532d217b6224e28aa1d726fe5afe45153046
