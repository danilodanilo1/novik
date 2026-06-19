import { execFile } from "node:child_process";
import { mkdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const VIDEOS_DIR = join(__dirname, "../public/videos");
const THUMBS_DIR = join(VIDEOS_DIR, "thumbs");

const VIDEOS = [
  "netflix-filme-power.mp4",
  "banco-do-brasil-gaules.mp4",
  "o-hype-continua.mp4",
  "caminho-do-major.mp4",
  "loja-vex-dragons.mp4",
  "entrevista-marcelo-tigrao-bb.mp4",
  "agradecimento-burburinho.mp4",
];

async function getDuration(input) {
  const { stdout } = await execFileAsync("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    input,
  ]);
  return Number.parseFloat(stdout.trim());
}

async function extractThumb(ffmpeg, video) {
  const input = join(VIDEOS_DIR, video);
  const base = video.replace(/\.[^.]+$/, "");
  const output = join(THUMBS_DIR, `${base}.jpg`);

  try {
    const existing = await stat(output);
    if (existing.size > 10_000) {
      console.log(`skip ${base}.jpg`);
      return;
    }
  } catch {
    // generate
  }

  let seek = 2;
  try {
    const duration = await getDuration(input);
    if (Number.isFinite(duration) && duration > 4) {
      seek = Math.min(Math.max(duration * 0.15, 1), duration - 1);
    }
  } catch {
    // keep default seek
  }

  await execFileAsync(ffmpeg, [
    "-hide_banner",
    "-loglevel",
    "error",
    "-ss",
    seek.toFixed(2),
    "-i",
    input,
    "-frames:v",
    "1",
    "-q:v",
    "2",
    "-vf",
    "scale=1280:-2",
    "-y",
    output,
  ]);

  const info = await stat(output);
  console.log(`created ${base}.jpg (${(info.size / 1024).toFixed(0)} KB, ss=${seek.toFixed(1)}s)`);
}

await mkdir(THUMBS_DIR, { recursive: true });

const ffmpeg = process.env.FFMPEG_PATH ?? "ffmpeg";
for (const video of VIDEOS) {
  await extractThumb(ffmpeg, video);
}

console.log("done");
