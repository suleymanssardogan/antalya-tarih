#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const fetch = global.fetch || require('node-fetch');

const SQL_FILE = path.join(__dirname, '..', 'supabase', 'migrations', '202411240002_seed_tarihi_yerler.sql');
const OUT_DIR = path.join(__dirname, 'downloaded_images');
const META_FILE = path.join(__dirname, 'image_metadata.json');

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 120);
}

function parsePlacesFromSQL(sql) {
  const re = /'([^']+)'\s*,\s*'[^']*'\s*,\s*'[^']*'\s*,\s*ST_SetSRID\(ST_MakePoint\(([\d\.-]+)\s*,\s*([\d\.-]+)\),\s*4326\)::geography/g;
  const places = [];
  let m;
  while ((m = re.exec(sql)) !== null) {
    const name = m[1];
    const lon = parseFloat(m[2]);
    const lat = parseFloat(m[3]);
    places.push({ name, lat, lon });
  }
  return places;
}

async function wikimediaSearchImageByName(name) {
  try {
    // Search for pages by name
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(name)}&sr=combined&srlimit=10`;
    const sres = await fetch(searchUrl);
    const sjson = await sres.json();
    const results = sjson.query && sjson.query.search ? sjson.query.search : [];
    for (const res of results) {
      const title = res.title;
      // Get page info
      const pageUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&titles=${encodeURIComponent(title)}&prop=pageimages|info&inprop=url&pithumbsize=2000`;
      const pres = await fetch(pageUrl);
      const pjson = await pres.json();
      const page = Object.values(pjson.query.pages)[0];
      if (!page) continue;
      const result = { pageTitle: title, pageUrl: page.fullurl || null };
      if (page.thumbnail && page.thumbnail.source) {
        result.imageUrl = page.thumbnail.source;
        return result;
      }
      // Fallback: get images from page
      const imgsUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&titles=${encodeURIComponent(title)}&prop=images&imlimit=5`;
      const ires = await fetch(imgsUrl);
      const ijson = await ires.json();
      const imgPage = Object.values(ijson.query.pages)[0];
      if (imgPage && imgPage.images && imgPage.images.length) {
        for (const img of imgPage.images) {
          const imgTitle = img.title;
          const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&titles=${encodeURIComponent(imgTitle)}&prop=imageinfo&iiprop=url|extmetadata`;
          const iinfoRes = await fetch(infoUrl);
          const iinfoJson = await iinfoRes.json();
          const infoPage = Object.values(iinfoJson.query.pages)[0];
          if (infoPage && infoPage.imageinfo && infoPage.imageinfo[0] && infoPage.imageinfo[0].url) {
            result.imageUrl = infoPage.imageinfo[0].url;
            result.extmetadata = infoPage.imageinfo[0].extmetadata || {};
            return result;
          }
        }
      }
    }
  } catch (err) {
    console.error('Wikimedia name search error:', err.message);
  }
  return null;
}

function turkishToAscii(s) {
  return s
    .replace(/[çÇ]/g, 'c')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[ıİ]/g, 'i')
    .replace(/[öÖ]/g, 'o')
    .replace(/[şŞ]/g, 's')
    .replace(/[üÜ]/g, 'u')
    .replace(/–/g, '-')
    .replace(/[^\w\s\-\(\)]/g, '');
}

function stripParentheses(s) {
  return s.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
}

function generateNameVariants(name) {
  const variants = new Set();
  const cleaned = name.trim();
  variants.add(cleaned);
  variants.add(stripParentheses(cleaned));
  variants.add(turkishToAscii(cleaned));
  variants.add(turkishToAscii(stripParentheses(cleaned)));

  // common prefixes/suffixes
  variants.add(`Antalya ${stripParentheses(cleaned)}`);
  variants.add(`Ancient ${stripParentheses(cleaned)}`);

  // known alias map (Turkish -> English/alternate)
  const aliasMap = {
    'Perge Antik Kenti': ['Perga', 'Perge'],
    'Aspendos Tiyatrosu': ['Aspendus', 'Aspendos'],
    'Olympos Antik Kenti': ['Olympos', 'Olympos (ancient city)'],
    'Chimaera (Yanartaş)': ['Chimaera', 'Yanartaş', 'Yanartaş (Chimaera)'],
    'Karain Mağarası': ['Karain Cave', 'Karain'],
    'Düden Şelalesi (Üst)': ['Duden Waterfalls', 'Duden Falls', 'Düden Şelalesi'],
    'Side Antik Kenti': ['Side', 'Side Ancient City'],
    'Phaselis Antik Kenti': ['Phaselis', 'Phaselis Ancient City'],
    'Termessos': ['Termessos', 'Termessos ancient city'],
    'Selge Antik Kenti': ['Selge', 'Selge Ancient City'],
  };

  if (aliasMap[cleaned]) {
    for (const a of aliasMap[cleaned]) variants.add(a);
  }

  // also try english-like conversions of common endings
  if (/Antik Kenti/i.test(cleaned)) {
    variants.add(cleaned.replace(/Antik Kenti/i, 'Ancient City'));
  }

  return Array.from(variants);
}

async function wikimediaSearchImage(lat, lon) {
  const gsUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&list=geosearch&gscoord=${lat}|${lon}&gsradius=2000&gslimit=10`;
  try {
    const gres = await fetch(gsUrl);
    const gjson = await gres.json();
    const pages = gjson.query && gjson.query.geosearch ? gjson.query.geosearch : [];
    for (const p of pages) {
      // Try to get a pageimage (thumbnail/original)
      const pid = p.pageid;
      const piUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&pageids=${pid}&prop=pageimages|info&inprop=url&pithumbsize=2000`;
      const pres = await fetch(piUrl);
      const pjson = await pres.json();
      const page = pjson.query && pjson.query.pages ? Object.values(pjson.query.pages)[0] : null;
      if (!page) continue;
      const result = {
        pageTitle: page.title,
        pageUrl: page.fullurl || null,
      };
      if (page.thumbnail && page.thumbnail.source) {
        result.imageUrl = page.thumbnail.source;
        return result;
      }

      // fallback: list images on page and fetch imageinfo for first image
      const imgsUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&pageids=${pid}&prop=images&imlimit=5`;
      const ires = await fetch(imgsUrl);
      const ijson = await ires.json();
      const page2 = ijson.query && ijson.query.pages ? Object.values(ijson.query.pages)[0] : null;
      if (page2 && page2.images && page2.images.length) {
        for (const img of page2.images) {
          const title = img.title; // File:...
          const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|extmetadata`;
          const iinfoRes = await fetch(infoUrl);
          const iinfoJson = await iinfoRes.json();
          const infoPage = Object.values(iinfoJson.query.pages)[0];
          if (infoPage && infoPage.imageinfo && infoPage.imageinfo[0] && infoPage.imageinfo[0].url) {
            result.imageUrl = infoPage.imageinfo[0].url;
            result.extmetadata = infoPage.imageinfo[0].extmetadata || {};
            return result;
          }
        }
      }
    }
  } catch (err) {
    console.error('Wikimedia search error', err.message);
  }
  return null;
}

async function downloadToFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(buffer));
}

async function main() {
  if (!fs.existsSync(SQL_FILE)) {
    console.error('SQL seed file not found:', SQL_FILE);
    process.exit(1);
  }
  const sql = fs.readFileSync(SQL_FILE, 'utf8');
  const places = parsePlacesFromSQL(sql);
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const meta = [];
  console.log(`Found ${places.length} places in SQL, starting search...`);
  for (const p of places) {
    try {
      const slug = slugify(p.name);
      console.log(`Searching image for: ${p.name} (${p.lat},${p.lon})`);
      let found = await wikimediaSearchImage(p.lat, p.lon);
      if (!found || !found.imageUrl) {
        console.log('  Geosearch failed, trying name-variant searches for:', p.name);
        const variants = generateNameVariants(p.name);
        for (const v of variants) {
          console.log('    Trying variant:', v);
          found = await wikimediaSearchImageByName(v);
          if (found && found.imageUrl) break;
          // small delay between variant attempts
          await new Promise((r) => setTimeout(r, 250));
        }
      }
      if (!found || !found.imageUrl) {
        console.log('  No image found on Wikimedia for', p.name);
        meta.push({ name: p.name, lat: p.lat, lon: p.lon, found: false });
        continue;
      }
      const ext = path.extname(new URL(found.imageUrl).pathname).split('?')[0] || '.jpg';
      const filename = `${slug}${ext}`;
      const dest = path.join(OUT_DIR, filename);
      console.log('  Downloading:', found.imageUrl);
      await downloadToFile(found.imageUrl, dest);
      console.log('  Saved to', dest);
      meta.push({ name: p.name, lat: p.lat, lon: p.lon, found: true, file: path.relative(process.cwd(), dest), source: found.pageUrl || found.imageUrl, imageUrl: found.imageUrl, pageTitle: found.pageTitle || null, extmetadata: found.extmetadata || null });
      // small delay to be nice to the API
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error('  Error for', p.name, err.message);
      meta.push({ name: p.name, lat: p.lat, lon: p.lon, found: false, error: err.message });
    }
  }
  fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2), 'utf8');
  console.log('Done. Metadata written to', META_FILE);
  const notFound = meta.filter((m) => !m.found).length;
  console.log(`${meta.length - notFound} images downloaded, ${notFound} not found.`);
  console.log('Next step: if you want, I can upload downloaded files to Supabase storage. To allow upload, set env var SUPABASE_SERVICE_ROLE_KEY and SUPABASE_URL, then run the upload script (not yet created).');
}

if (require.main === module) main();
