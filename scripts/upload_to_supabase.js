#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const fetch = global.fetch || require('node-fetch');

const META_FILE = path.join(__dirname, 'image_metadata.json');
const BASE_DIR = path.join(__dirname, 'downloaded_images');
const BUCKET = process.env.SUPABASE_BUCKET || 'images';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  console.error('Set these then re-run:');
  console.error('export SUPABASE_URL="https://your-project.supabase.co"');
  console.error('export SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"');
  process.exit(1);
}

async function createBucketIfNeeded() {
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/bucket`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ name: BUCKET, public: true }),
    });
    if (res.status === 409) {
      console.log('Bucket already exists:', BUCKET);
      return;
    }
    if (!res.ok) {
      const t = await res.text();
      console.warn('Create bucket response:', res.status, t);
      return;
    }
    console.log('Bucket created:', BUCKET);
  } catch (err) {
    console.warn('Create bucket request failed:', err.message);
  }
}

async function uploadFile(localPath, destPath) {
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/${encodeURIComponent(BUCKET)}/${encodeURIComponent(destPath)}`;
  const data = fs.readFileSync(localPath);
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/octet-stream',
      'x-upsert': 'true',
    },
    body: data,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Upload failed ${res.status}: ${txt}`);
  }
  return `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${encodeURIComponent(BUCKET)}/${encodeURIComponent(destPath)}`;
}

async function main() {
  if (!fs.existsSync(META_FILE)) {
    console.error('Metadata file not found at', META_FILE);
    process.exit(1);
  }
  const meta = JSON.parse(fs.readFileSync(META_FILE, 'utf8'));
  await createBucketIfNeeded();
  for (const item of meta) {
    if (!item.found || !item.file) continue;
    const local = path.join(process.cwd(), item.file);
    if (!fs.existsSync(local)) {
      console.warn('Local file missing, skipping:', local);
      continue;
    }
    const basename = path.basename(local);
    const destPath = `places/${basename}`;
    try {
      console.log('Uploading', local, '->', destPath);
      const publicUrl = await uploadFile(local, destPath);
      item.supabase = { bucket: BUCKET, path: destPath, publicUrl };
      console.log('Uploaded:', publicUrl);
      // small delay
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.error('Upload error for', local, err.message);
    }
  }
  fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2));
  console.log('Upload complete. Metadata updated at', META_FILE);
}

if (require.main === module) main();
