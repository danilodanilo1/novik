import fs from "fs";

const html = fs.readFileSync("tmp-yt.html", "utf8");

const thumbPattern = /\/vi\/([A-Za-z0-9_-]{11})\/hqdefault\.jpg/g;
const lockupChunks = html.split('"lockupViewModel":');

const videos = new Map();

for (let i = 1; i < lockupChunks.length; i++) {
  const chunk = lockupChunks[i].slice(0, 6000);

  const idMatch = chunk.match(/\/vi\/([A-Za-z0-9_-]{11})\/hqdefault\.jpg/);
  if (!idMatch) continue;
  const id = idMatch[1];

  const titleMatch = chunk.match(/"title":\{"content":"((?:\\.|[^"\\])*)"\}/);
  const durationMatch = chunk.match(
    /"thumbnailBadgeViewModel":\{"text":"((?:\\.|[^"\\])*)"/,
  );
  const viewsMatch = chunk.match(
    /"text":\{"content":"((?:\\.|[^"\\])*visualiza(?:ç|c)(?:õ|o)es(?:[^"\\])*)"\}/i,
  );

  if (!titleMatch) continue;

  const decode = (s) =>
    s
      .replace(/\\u([\dA-Fa-f]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\\"/g, '"');

  videos.set(id, {
    id,
    title: decode(titleMatch[1]),
    views: decode(viewsMatch?.[1] ?? ""),
    duration: decode(durationMatch?.[1] ?? ""),
  });
}

function parseViews(text) {
  if (!text) return 0;
  const t = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s/g, "")
    .replace(/visualizacoes/g, "");

  if (t.includes("mil")) {
    return parseFloat(t.replace("mil", "").replace(",", ".")) * 1000;
  }
  if (t.includes("mi") && !t.includes("mil")) {
    return parseFloat(t.replace("mi", "").replace(",", ".")) * 1_000_000;
  }

  return parseFloat(t.replace(/\./g, "").replace(",", ".")) || 0;
}

const list = [...videos.values()].sort((a, b) => parseViews(b.views) - parseViews(a.views));
console.log(JSON.stringify({ count: list.length, top: list.slice(0, 8) }, null, 2));
