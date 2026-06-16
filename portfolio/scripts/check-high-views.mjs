import fs from "fs";

const ids = fs.readFileSync("scripts/all-ids.txt", "utf8").trim().split("\n");
const results = [];

for (const id of ids) {
  const html = await fetch(`https://www.youtube.com/watch?v=${id}`, {
    headers: { "User-Agent": "Mozilla/5.0" },
  }).then((r) => r.text());

  const views = parseInt(html.match(/"viewCount":"(\d+)"/)?.[1] ?? "0", 10);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.replace(" - YouTube", "") ?? "?";

  results.push({ id, views, title: title.replace(/&quot;/g, '"') });
}

results.sort((a, b) => b.views - a.views);

for (const v of results.filter((x) => x.views >= 40000)) {
  console.log(`${v.views} | ${v.title} | ${v.id}`);
}
