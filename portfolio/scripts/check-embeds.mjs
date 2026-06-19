const ids = [
  "hl3m5BPLC4Q",
  "Q3GC2bczNaw",
  "3kNNiiK70Y0",
  "PEroWu6n65g",
  "h12J7gyT3Pw",
  "Tj6fJiGlsqY",
];

for (const id of ids) {
  const html = await fetch(`https://www.youtube.com/watch?v=${id}`, {
    headers: { "User-Agent": "Mozilla/5.0" },
  }).then((r) => r.text());
  const blocked = html.includes('"playableInEmbed":false');
  console.log(`${id} ${blocked ? "BLOCKED" : "embeddable"}`);
}
