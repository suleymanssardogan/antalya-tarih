-- PostGIS uzantisini aktiflestir
CREATE EXTENSION IF NOT EXISTS postgis;

-- Tarihi yerler tablosu
CREATE TABLE IF NOT EXISTS public.tarihi_yerler (
    id SERIAL PRIMARY KEY,
    ad TEXT NOT NULL,
    aciklama TEXT,
    kategori TEXT,
    geom GEOGRAPHY(Point, 4326) NOT NULL
);

-- Konumsal sorgular icin indeks
CREATE INDEX IF NOT EXISTS tarihi_yerler_geom_idx
    ON public.tarihi_yerler
    USING GIST (geom);

