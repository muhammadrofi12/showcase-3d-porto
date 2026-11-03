import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import sharp from "sharp";

const sourceRoot = process.argv[2];
if (!sourceRoot)
  throw new Error(
    "Usage: node scripts/import-portfolio.mjs <portfolio-directory>",
  );

const source = path.join(sourceRoot, "src/data/portofolioData.js");
let code = fs.readFileSync(source, "utf8");
const assetPaths = {};
const bindings = {};
for (const match of code.matchAll(/import\s+(\w+)\s+from\s+"([^"]+)";/g)) {
  const [, name, relative] = match;
  assetPaths[name] = path.resolve(path.dirname(source), relative);
  bindings[name] = name;
}

code = code
  .replace(/^import .*;\s*$/gm, "")
  .replace(/export default portofolioData;?/, "");
const raw = vm.runInNewContext(code + "\nportofolioData;", bindings);
const text = (v) => (typeof v === "string" ? v : v?.id || v?.en || "");
const slug = (v) =>
  v
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

// Reset public/artworks and group images neatly into per-project folders
fs.rmSync("public/artworks", { recursive: true, force: true });
fs.mkdirSync("public/artworks", { recursive: true });

let totalImages = 0;
const projects = [];

for (const p of raw) {
  const id = slug(p.title);
  const folderName = slug(p.title.split(" — ")[0].replace(" (OCS)", ""));
  const projectDir = path.join("public/artworks", folderName);
  fs.mkdirSync(projectDir, { recursive: true });

  const allKeys = [...new Set([p.image, ...(p.gallery || [])])].filter(Boolean);
  const convertedUrls = [];

  for (const key of allKeys) {
    const srcFile = assetPaths[key];
    if (!srcFile) continue;
    const outPath = path.join(projectDir, `${key}.webp`);
    await sharp(srcFile)
      .resize({
        width: 1400,
        height: 1100,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toFile(outPath);
    convertedUrls.push(`/artworks/${folderName}/${key}.webp`);
    totalImages++;
  }

  projects.push({
    id,
    title: p.title,
    description: text(p.description),
    overview: text(p.overview),
    role: text(p.services),
    year: p.year,
    categories: p.categories,
    tech: p.tech,
    cover: convertedUrls[0] || "",
    images: convertedUrls,
    links: (p.links || []).map((l) => ({ label: text(l.label), url: l.href })),
    caseStudy: `https://rofiull.vercel.app/portfolio/${id}`,
  });
}

// Import AI Product Visuals collection from src/data/productAiData.js
const aiSource = path.join(sourceRoot, "src/data/productAiData.js");
const aiSectionSource = path.join(
  sourceRoot,
  "src/components/ProductAiSection.jsx",
);
let catalogUrl = "https://lynk.id/rofiull";
if (fs.existsSync(aiSectionSource)) {
  const sectionCode = fs.readFileSync(aiSectionSource, "utf8");
  const urlMatch = sectionCode.match(/href="(https:\/\/lynk\.id\/[^"]+)"/);
  if (urlMatch) catalogUrl = urlMatch[1];
}

const aiVisuals = [];
if (fs.existsSync(aiSource)) {
  const aiCode = fs.readFileSync(aiSource, "utf8");
  fs.mkdirSync("public/ai-visuals", { recursive: true });
  const imports = [
    ...aiCode.matchAll(/import\s+(\w+)\s+from\s+"([^"]+)";/g),
  ];
  // 3-3-2 shelf layout across 3 horizontal shelves
  const shelfMap = [
    { shelf: 0, slot: 0 },
    { shelf: 0, slot: 1 },
    { shelf: 0, slot: 2 },
    { shelf: 1, slot: 0 },
    { shelf: 1, slot: 1 },
    { shelf: 1, slot: 2 },
    { shelf: 2, slot: 0 },
    { shelf: 2, slot: 1 },
  ];
  for (let i = 0; i < imports.length; i++) {
    const [, , relative] = imports[i];
    const asset = path.resolve(path.dirname(aiSource), relative);
    const num = String(i + 1).padStart(2, "0");
    const fileBase = `product-ai-${i + 1}`;
    const meta = await sharp(asset).metadata();
    const width = meta.width || 1200;
    const height = meta.height || 1200;
    const aspect = Number((width / height).toFixed(4));

    // Shelf texture derivative (lightweight for 3D scene and grid cards)
    await sharp(asset)
      .resize({
        width: 720,
        height: 900,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(`public/ai-visuals/${fileBase}-shelf.webp`);

    // Detail image derivative (higher resolution loaded on demand in modal)
    await sharp(asset)
      .resize({
        width: 1600,
        height: 2000,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 86 })
      .toFile(`public/ai-visuals/${fileBase}.webp`);

    const layout = shelfMap[i] || { shelf: 2, slot: i - 6 };
    aiVisuals.push({
      id: `ai-visual-${num}`,
      order: i + 1,
      title: `AI Product Visual ${num}`,
      shelf: layout.shelf,
      slot: layout.slot,
      texture: `/ai-visuals/${fileBase}-shelf.webp`,
      image: `/ai-visuals/${fileBase}.webp`,
      width,
      height,
      aspect,
      alt: `AI Product Visual ${num} — Eksplorasi visual produk berbantuan AI`,
      label: "Karya berbantuan AI",
      caption:
        "Koleksi visual produk komersial pilihan yang dibuat dengan kecerdasan buatan generatif.",
      catalogUrl,
    });
  }
}

fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync("src/data/projects.json", JSON.stringify(projects, null, 2));
fs.writeFileSync(
  "src/data/ai-visuals.json",
  JSON.stringify(aiVisuals, null, 2),
);
console.log(
  `Imported ${projects.length} projects (${totalImages} images grouped in folders) and ${aiVisuals.length} AI product visuals.`,
);
