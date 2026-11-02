import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectsDir = path.resolve(process.cwd(), "public/projects");

async function convert() {
  const files = await fs.readdir(projectsDir);
  const pngFiles = files.filter((f) => f.endsWith(".png"));

  console.log(`Found ${pngFiles.length} PNG files in ${projectsDir}`);

  for (const file of pngFiles) {
    const inputPath = path.join(projectsDir, file);
    const outputName = file.replace(/\.png$/, ".webp");
    const outputPath = path.join(projectsDir, outputName);

    const image = sharp(inputPath);
    const metadata = await image.metadata();

    let transform = image;
    if (metadata.width && metadata.width > 1600) {
      transform = transform.resize({ width: 1600, withoutEnlargement: true });
    }

    await transform
      .webp({ quality: 85, effort: 5 })
      .toFile(outputPath);

    const stats = await fs.stat(outputPath);
    console.log(`Converted ${file} -> ${outputName} (${(stats.size / 1024).toFixed(1)} KB)`);
  }
}

convert().catch((err) => {
  console.error(err);
  process.exit(1);
});
