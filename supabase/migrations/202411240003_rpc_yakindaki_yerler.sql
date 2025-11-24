DROP FUNCTION IF EXISTS public.yakindaki_yerler(
    lat DOUBLE PRECISION,
    lon DOUBLE PRECISION,
    radius DOUBLE PRECISION
);

CREATE OR REPLACE FUNCTION public.yakindaki_yerler
    lat DOUBLE PRECISION,
    lon DOUBLE PRECISION,
    radius DOUBLE PRECISION DEFAULT 5000
)
RETURNS TABLE (
    id INTEGER,
    ad TEXT,
    kategori TEXT,
    lat DOUBLE PRECISION,
    lon DOUBLE PRECISION,
    gorsel_url TEXT,
    mesafe_m DOUBLE PRECISION
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        ty.id,
        ty.ad,
        ty.kategori,
        ST_Y(ty.geom::geometry) AS lat,
        ST_X(ty.geom::geometry) AS lon,
        ty.gorsel_url,
        ST_Distance(
            ty.geom,
            ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography
        ) AS mesafe_m
    FROM public.tarihi_yerler AS ty
    WHERE ST_DWithin(
        ty.geom,
        ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography,
        radius
    )
    ORDER BY mesafe_m ASC;
$$;

