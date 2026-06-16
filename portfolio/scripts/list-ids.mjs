import fs from "fs";

const html = fs.readFileSync(process.argv[2] ?? "tmp-yt-all.html", "utf8");
const ids = [...new Set([...html.matchAll(/\/vi\/([A-Za-z0-9_-]{11})\//g)].map((m) => m[1]))];
console.log("unique video ids:", ids.length);
console.log(ids.join("\n"));
