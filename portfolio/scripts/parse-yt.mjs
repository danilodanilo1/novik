import fs from "fs";

const file = process.argv[2] ?? "tmp-yt-popular.html";
const html = fs.readFileSync(file, "utf8");

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

console.log("Total:", list.length);
console.log("\nTop 15:");
for (const v of list.slice(0, 15)) {
  console.log(`${parseViews(v.views).toLocaleString("pt-BR")} | ${v.duration} | ${v.title} | ${v.id}`);
}

const near61 = list.filter((v) => {
  const n = parseViews(v.views);
  return n >= 55000 && n <= 70000;
});
console.log("\nVideos 55k-70k:");
console.log(JSON.stringify(near61, null, 2));
