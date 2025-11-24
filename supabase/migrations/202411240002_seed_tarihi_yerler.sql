INSERT INTO public.tarihi_yerler (ad, aciklama, kategori, geom)
VALUES
    ('Kaleiçi', 'Roma, Selçuklu ve Osmanlı izlerini taşıyan tarihi kent çekirdeği.', 'Mahalle', ST_SetSRID(ST_MakePoint(30.7054, 36.8841), 4326)::geography),
    ('Hadrian Kapısı', 'MS 130’da imparator Hadrianus için inşa edilen anıtsal kapı.', 'Anıtsal Kapı', ST_SetSRID(ST_MakePoint(30.7091, 36.8838), 4326)::geography),
    ('Hıdırlık Kulesi', '2. yüzyıldan kalma Roma gözetleme ve deniz feneri kulesi.', 'Kule', ST_SetSRID(ST_MakePoint(30.7018, 36.8846), 4326)::geography),
    ('Yivli Minare', '13. yüzyıl Selçuklu mimarisinin simgesi olan minare.', 'Cami', ST_SetSRID(ST_MakePoint(30.7041, 36.8853), 4326)::geography),
    ('Antalya Saat Kulesi', 'Kaleiçi girişindeki Osmanlı dönemi saat kulesi.', 'Kule', ST_SetSRID(ST_MakePoint(30.7050, 36.8859), 4326)::geography),
    ('Kesik Minare (Korkut Camii)', 'Temelleri Roma dönemine uzanan çok katmanlı ibadet yapısı.', 'Cami', ST_SetSRID(ST_MakePoint(30.7070, 36.8831), 4326)::geography),
    ('Suna-İnan Kıraç Kaleiçi Müzesi', 'Geleneksel Antalya evleri ve etnografik koleksiyon.', 'Müze', ST_SetSRID(ST_MakePoint(30.7061, 36.8842), 4326)::geography),
    ('Antalya Müzesi', 'Likya, Pamfilya ve Pisidya eserlerini barındıran arkeoloji müzesi.', 'Müze', ST_SetSRID(ST_MakePoint(30.6888, 36.8845), 4326)::geography),
    ('Karain Mağarası', 'Türkiye’nin en büyük doğal mağaralarından, Paleolitik yerleşim.', 'Mağara', ST_SetSRID(ST_MakePoint(30.5219, 37.0221), 4326)::geography),
    ('Perge Antik Kenti', 'Pamfilya’nın önemli Roma kentlerinden biri.', 'Antik Kent', ST_SetSRID(ST_MakePoint(30.8525, 36.9672), 4326)::geography),
    ('Aspendos Tiyatrosu', 'Dünyanın en iyi korunmuş Roma tiyatrolarından.', 'Antik Tiyatro', ST_SetSRID(ST_MakePoint(31.1722, 36.9391), 4326)::geography),
    ('Termessos', 'Güllük Dağı Milli Parkı’ndaki Pisidya kenti.', 'Antik Kent', ST_SetSRID(ST_MakePoint(30.5325, 37.0035), 4326)::geography),
    ('Side Antik Kenti', 'Apollon Tapınağı ve antik limanıyla ünlü yerleşim.', 'Antik Kent', ST_SetSRID(ST_MakePoint(31.3895, 36.7676), 4326)::geography),
    ('Phaselis Antik Kenti', 'Likya uygarlığının ticari liman kenti.', 'Antik Kent', ST_SetSRID(ST_MakePoint(30.5519, 36.5190), 4326)::geography),
    ('Olympos Antik Kenti', 'Likya Birliği’ne ait sahil kenti ve yanar taş efsanesi.', 'Antik Kent', ST_SetSRID(ST_MakePoint(30.4732, 36.3964), 4326)::geography),
    ('Chimaera (Yanartaş)', 'Doğal gaz çıkışlarıyla sürekli yanan kayalık alan.', 'Doğal Alan', ST_SetSRID(ST_MakePoint(30.4710, 36.4055), 4326)::geography),
    ('Düden Şelalesi (Üst)', 'Roma döneminden su yapılarıyla çevrili doğal alan.', 'Doğal Alan', ST_SetSRID(ST_MakePoint(30.7281, 36.9565), 4326)::geography),
    ('Ariassos Antik Kenti', 'Toros eteklerinde iyi korunmuş Pisidya şehri.', 'Antik Kent', ST_SetSRID(ST_MakePoint(30.4467, 37.1940), 4326)::geography),
    ('Selge Antik Kenti', 'Köprülü Kanyon yakınındaki dağlık Pisidya kenti.', 'Antik Kent', ST_SetSRID(ST_MakePoint(31.1784, 37.1132), 4326)::geography),
    ('Silifke Karasis (Lyrboton Kome)', 'Antalya yakınındaki antik zeytinyağı üretim merkezi.', 'Antik Yerleşim', ST_SetSRID(ST_MakePoint(30.7695, 37.0758), 4326)::geography);

