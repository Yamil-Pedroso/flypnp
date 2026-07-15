import { existsSync } from "fs";
import path from "path";
import dotenv from "dotenv";

const configPath = [
  process.env.CONFIG_PATH,
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "src", "config", "config.env"),
].find((candidate): candidate is string => Boolean(candidate && existsSync(candidate)));

if (configPath) dotenv.config({ path: configPath, quiet: true });

export const requireEnv = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
};
