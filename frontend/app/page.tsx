'use client';

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../lib/supabase";

const Map = dynamic(() => import("../components/Map"), {
  ssr: false
});

type Place = {
  id: number;
  ad: string;
  kategori: string;
  lat: number;
  lon: number;
  gorsel_url?: string | null;
  mesafe_m: number;
};

const DEFAULT_RADIUS = 10000;
const DEFAULT_CENTER: [number, number] = [36.8841, 30.7054];

export default function HomePage() {
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [userLocation, setUserLocation] = useState<[number, number]>(DEFAULT_CENTER);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Yeni özellikler için state'ler
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Tarayıcınız konum bilginizi alamıyor. Antalya merkezi kullanılıyor.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setError(null);
      },
      () => {
        setError("Konum izni reddedildi. Antalya merkezi üzerinden sorgu yapılıyor.");
        setUserLocation(DEFAULT_CENTER);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const fetchPlaces = useCallback(
    async (lat: number, lon: number, searchRadius: number) => {
      setLoading(true);
      setError(null);
      const { data, error: rpcError } = await supabase.rpc("yakindaki_yerler", {
        lat,
        lon,
        radius: searchRadius
      });
      if (rpcError) {
        setError(rpcError.message);
        setPlaces([]);
      } else {
        setPlaces(data ?? []);
      }
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    if (userLocation) {
      fetchPlaces(userLocation[0], userLocation[1], radius);
    }
  }, [fetchPlaces, radius, userLocation]);

  const handleManualSearch = () => {
    if (userLocation) {
      fetchPlaces(userLocation[0], userLocation[1], radius);
    }
  };

  // Kategorileri dinamik olarak çıkar
  const categories = ["Tümü", ...Array.from(new Set(places.map((p) => p.kategori))).sort()];

  // Filtreleme mantığı
  const filteredPlaces = places.filter((place) => {
    const matchesSearch = place.ad.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tümü" || place.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <header>
        <p className="text-sm uppercase tracking-wide text-emerald-300">
          Antalya
        </p>
        <h1 className="text-3xl font-semibold">Yakındaki Tarihi Yerler</h1>
        <p className="text-sm text-slate-400">
          Supabase + PostGIS RPC fonksiyonunu kullanarak bulunduğun noktaya en yakın tarihi mekanları listeler.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="min-h-[480px]">
          {/* Haritaya filtrelenmiş mekanları gönderiyoruz */}
          <Map userLocation={userLocation} radius={radius} places={filteredPlaces} />
        </div>

        <div className="flex flex-col gap-4">
          {/* Arama ve Filtreleme Alanı */}
          <div className="rounded-xl border border-white/10 bg-slate-900 p-4 space-y-4">
            <h2 className="font-semibold text-lg text-white">Filtrele & Ara</h2>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Mekan Ara</label>
              <input
                type="text"
                placeholder="Örn: Müze, Cami..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ayarlar Alanı */}
          <div className="rounded-xl border border-white/10 bg-slate-900 p-4 space-y-3">
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-slate-400">Arama Yarıçapı (metre)</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={500}
                  max={50000}
                  step={500}
                  value={radius}
                  onChange={(event) => setRadius(Number(event.target.value))}
                  className="flex-1 accent-emerald-500"
                />
                <span className="w-16 text-right font-mono text-emerald-300">{radius}m</span>
              </div>
            </label>
            <button
              type="button"
              onClick={handleManualSearch}
              className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700"
              disabled={loading}
            >
              {loading ? "Sorgulanıyor..." : "Yenile"}
            </button>
            {error && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}
          </div>

          {/* Sonuç Listesi */}
          <div className="flex-1 overflow-y-auto max-h-[500px] space-y-3 pr-1 custom-scrollbar">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Sonuçlar</span>
              <span>{filteredPlaces.length} mekan bulundu</span>
            </div>
            
            {loading && filteredPlaces.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">Veriler getiriliyor...</p>
            )}
            
            {!loading && filteredPlaces.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <p>Sonuç bulunamadı.</p>
                <p className="text-xs mt-1">Arama kriterlerini veya yarıçapı değiştirmeyi deneyin.</p>
              </div>
            )}

            {filteredPlaces.map((place) => (
              <article
                key={place.id}
                className="group relative flex gap-3 rounded-lg border border-white/5 bg-slate-950/50 p-3 hover:border-emerald-500/30 transition"
              >
                {place.gorsel_url ? (
                  <img
                    src={place.gorsel_url}
                    alt={place.ad}
                    className="h-20 w-20 rounded-md object-cover flex-shrink-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-md bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-600">
                    <span className="text-xs">Görsel Yok</span>
                  </div>
                )}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <h3 className="font-semibold truncate text-emerald-50 group-hover:text-emerald-400 transition">{place.ad}</h3>
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                      {place.kategori}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500 font-mono">
                      {place.mesafe_m < 1000 
                        ? `${place.mesafe_m.toFixed(0)} m` 
                        : `${(place.mesafe_m / 1000).toFixed(1)} km`}
                    </span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}${
                        userLocation ? `&origin=${userLocation[0]},${userLocation[1]}` : ""
                      }`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-emerald-500 hover:text-emerald-400 hover:underline"
                    >
                      Yol Tarifi &rarr;
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

