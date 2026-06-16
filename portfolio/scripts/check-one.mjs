const html = await fetch("https://www.youtube.com/watch?v=hl3m5BPLC4Q", {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text());

console.log({
  views: html.match(/"viewCount":"(\d+)"/)?.[1],
  embedBlocked: html.includes('"playableInEmbed":false'),
});
