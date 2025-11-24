# 📍 Antalya Tarihi Yerler — Yakındaki Yer Bulucu

Antalya’daki tarihi mekanları **Supabase (PostgreSQL + PostGIS)** ve **Next.js 14** kullanarak harita üzerinde gösteren, mesafe hesaplayan ve kullanıcı konumuna göre en yakın yerleri listeleyen modern bir GIS uygulaması.

[**🌐 Canlı Demo İçin Tıklayın**](https://antalya-tarih1.vercel.app/)

---

## 🧭 Özellikler

- **Konum Bazlı Servisler:** Kullanıcının anlık konumunu tespit etme.
- **PostGIS Entegrasyonu:** `ST_Distance` ve `ST_DWithin` fonksiyonları ile hassas mesafe hesaplama.
- **Akıllı Harita:** Leaflet ile interaktif harita, marker ve popup gösterimi.
- **Yakınlık Sıralaması:** Supabase RPC ile veritabanı seviyesinde yarıçap bazlı filtreleme.
- **Modern Arayüz:** Next.js 14 ve Tailwind CSS ile geliştirilmiş, mobil uyumlu ve koyu tema (Dark Mode) destekli tasarım.
- **Navigasyon:** Google Maps üzerinden seçilen mekana rota oluşturma.

---

## 🛠️ Teknolojiler

| Katman | Teknoloji |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), Tailwind CSS |
| **Harita** | Leaflet, React-Leaflet |
| **Backend / DB** | Supabase (PostgreSQL), PostGIS Extension |
| **Sorgular** | Supabase RPC (Remote Procedure Calls) |
| **Dil** | TypeScript |

---

## 📁 Proje Yapısı

```bash
antalya-tarih/
│
├── supabase/
│   └── migrations/
│       ├── 202411240001_init.sql           # Tablo kurulumları
│       ├── 202411240002_seed_tarihi.sql    # Örnek veriler
│       ├── 202411240003_rpc_yakindaki.sql  # PostGIS fonksiyonu
│       └── 202411240004_add_images.sql     # Görsel güncellemeleri
│
└── frontend/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/
    │   └── Map.tsx        # Harita bileşeni
    ├── lib/
    │   └── supabase.ts    # Supabase istemci ayarı
    ├── public/
    ├── package.json
    └── tsconfig.json
```

🗄️ Veritabanı Mimarisi (Supabase & PostGIS)
Bu proje coğrafi sorgular için PostGIS eklentisini kullanır.

