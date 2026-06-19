import { createWriteStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../public/videos");

const FILES = [
  {
    id: "19Ms274YUVlg1E2AOAvj6XikTZyzV4n3S",
    name: "banco-do-brasil-gaules.mp4",
  },
  {
    id: "1ybSRPokkY-xGw94kJaWAyGzGPB-yVro_",
    name: "netflix-filme-power.mp4",
  },
  {
    id: "1-1ttgrg_6KTMqisM6S3Z-MD1ymTQjZbH",
    name: "o-hype-continua.mp4",
  },
  {
    id: "1cbLiUATf2THJth3MAbu_yI0nPenWTzsA",
    name: "agradecimento-burburinho.mp4",
  },
  {
    id: "1p3kdW2v6XaauG1QXRMuJhL2d2aG1Rd4z",
    name: "caminho-do-major.mp4",
  },
  {
    id: "1nklBaTKDRVi5LKBcoDruF5JyC2REkYIW",
    name: "entrevista-marcelo-tigrao-bb.mp4",
  },
  {
    id: "1fhvIdWLF9wbYH4JQHJpqHvh9kTWF4qKp",
    name: "loja-vex-dragons.mp4",
  },
];

async function getDownloadUrl(fileId) {
  const pageUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const res = await fetch(pageUrl, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });
  const html = await res.text();

  const formAction = html.match(/id="download-form"[^>]*action="([^"]+)"/)?.[1];
  const hiddenFields = [...html.matchAll(/<input type="hidden" name="([^"]+)" value="([^"]*)"/g)];
  if (formAction && hiddenFields.length > 0) {
    const params = new URLSearchParams();
    for (const [, name, value] of hiddenFields) params.set(name, value);
    const action = formAction.startsWith("http")
      ? formAction
      : `https://drive.usercontent.google.com${formAction}`;
    return `${action}?${params.toString()}`;
  }

  const token = html.match(/confirm=([0-9A-Za-z_-]+)/)?.[1];
  if (token) return `${pageUrl}&confirm=${token}`;

  return `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
}

async function downloadFile({ id, name }) {
  const dest = join(OUT_DIR, name);
  try {
    const existing = await stat(dest);
    if (existing.size > 1_000_000) {
      console.log(`skip ${name} (${(existing.size / 1_048_576).toFixed(1)} MB)`);
      return dest;
    }
  } catch {
    // not exists
  }

  console.log(`downloading ${name}...`);
  const url = await getDownloadUrl(id);
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${name}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("text/html")) {
    throw new Error(`Got HTML instead of file for ${name}`);
  }

  await pipeline(res.body, createWriteStream(dest));

  const info = await stat(dest);
  console.log(`done ${name} (${(info.size / 1_048_576).toFixed(1)} MB)`);
  return dest;
}

await mkdir(OUT_DIR, { recursive: true });

for (const file of FILES) {
  try {
    await downloadFile(file);
  } catch (err) {
    console.error(`error ${file.name}:`, err.message);
  }
}

console.log("finished");
