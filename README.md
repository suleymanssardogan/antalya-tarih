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

