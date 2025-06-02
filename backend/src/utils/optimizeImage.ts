// utils/optimizeImage.ts
import sharp from "sharp";
import axios from "axios";
import path from "path";
import fs from "fs/promises";
import { v4 as uuid } from "uuid";

export const optimizeImageFromUrl = async (
  url: string,
  outputDir: string
): Promise<string> => {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data, "binary");
  const filename = `${uuid()}.webp`;
  const outputPath = path.join(outputDir, filename);

  await sharp(buffer)
    .resize({ width: 1200 }) // puedes ajustar esto
    .webp({ quality: 75 })
    .toFile(outputPath);

  return `/uploads/${filename}`; // o la ruta en Cloudinary/S3
};
