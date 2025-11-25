-- Gorsel kolonu yoksa ekle
ALTER TABLE IF EXISTS public.tarihi_yerler
    ADD COLUMN IF NOT EXISTS gorsel_url TEXT;

-- Her kayit icin Wikimedia veya resmi bir kaynaktan goruntu url'leri
UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/3/32/Antalya_Kalei%C3%A7i_view.jpg'
WHERE ad = 'Kaleiçi';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Antalya%2C_Hadrian%27s_Gate%2C_Turkey.jpg'
WHERE ad = 'Hadrian Kapısı';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/H%C4%B1d%C4%B1rl%C4%B1k_Tower_in_Antalya%2C_Turkey.jpg'
WHERE ad = 'Hıdırlık Kulesi';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/8/86/Yivliminare_mosque_2006_1.jpg'
WHERE ad = 'Yivli Minare';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Antalya_Saat_Kulesi.jpg'
WHERE ad = 'Antalya Saat Kulesi';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/2/21/Kesik_Minare_Antalya.jpg'
WHERE ad = 'Kesik Minare (Korkut Camii)';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Suna_%C4%B0nan_K%C4%B1ra%C3%A7_Kalei%C3%A7i_M%C3%BCzesi_-_Antalya.jpg'
WHERE ad = 'Suna-İnan Kıraç Kaleiçi Müzesi';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/7/79/Antalya_Museum_Front.jpg'
WHERE ad = 'Antalya Müzesi';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Karain_Cave_-_Entrance.jpg'
WHERE ad = 'Karain Mağarası';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Perge_-_stadium.jpg'
WHERE ad = 'Perge Antik Kenti';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/3/31/Aspendos_amphitheatre%2C_Antalya%2C_Turkey.jpg'
WHERE ad = 'Aspendos Tiyatrosu';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Termessos_Theatre_Turkey.jpg'
WHERE ad = 'Termessos';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Side_%28Turkey%29_Theatre_01.jpg'
WHERE ad = 'Side Antik Kenti';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Phaselis_Ruins.jpg'
WHERE ad = 'Phaselis Antik Kenti';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Olympos_coast.jpg'
WHERE ad = 'Olympos Antik Kenti';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/5/50/Chimaera_Yanarta%C5%9F.jpg'
WHERE ad = 'Chimaera (Yanartaş)';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Du%CC%88den_Waterfalls.jpg'
WHERE ad = 'Düden Şelalesi (Üst)';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Ariassos_triple_gate.jpg'
WHERE ad = 'Ariassos Antik Kenti';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Selge_antique_city_-_amphitheatre.jpg'
WHERE ad = 'Selge Antik Kenti';

UPDATE public.tarihi_yerler
SET gorsel_url = 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Lyrboton_Kome_ruins.jpg'
WHERE ad = 'Silifke Karasis (Lyrboton Kome)';


