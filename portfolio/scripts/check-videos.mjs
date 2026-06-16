import fs from "fs";

const ids = fs
  .readFileSync("scripts/all-ids.txt", "utf8")
  .trim()
  .split("\n")
  .filter(Boolean);

const results = [];

for (const id of ids) {
  const res = await fetch(`https://www.youtube.com/watch?v=${id}`, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const html = await res.text();
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.replace(" - YouTube", "") ?? "?";
  const views = parseInt(html.match(/"viewCount":"(\d+)"/)?.[1] ?? "0", 10);
  const embeddable = html.includes('"playableInEmbed":false') ? false : true;

  results.push({
    id,
    title: title.replace(/&quot;/g, '"').replace(/&amp;/g, "&"),
    views,
    embeddable,
  });
}

results.sort((a, b) => b.views - a.views);

console.log("Videos >= 50k:");
for (const v of results.filter((v) => v.views >= 50000)) {
  console.log(`${(v.views / 1000).toFixed(1)}k | embed:${v.embeddable} | ${v.title} | ${v.id}`);
}

console.log("\nTop 10:");
for (const v of results.slice(0, 10)) {
  console.log(`${(v.views / 1000).toFixed(1)}k | embed:${v.embeddable} | ${v.title} | ${v.id}`);
}

console.log("\nNon-embeddable:");
for (const v of results.filter((v) => !v.embeddable)) {
  console.log(`${(v.views / 1000).toFixed(1)}k | ${v.title} | ${v.id}`);
}
