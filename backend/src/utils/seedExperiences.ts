import "../config/env";
import mongoose from "mongoose";
import connectDB from "../config/db";
import { experiences } from "../data/experiences";
import { Experience } from "../models/Experience";

const seedExperiences = async () => {
  try {
    await connectDB();
    await Promise.all(
      experiences.map(({ slug, ...experience }) =>
        Experience.findOneAndUpdate(
          { slug },
          { ...experience, slug },
          { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
        )
      )
    );
    console.log(`${experiences.length} experiences seeded`);
    await mongoose.disconnect();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error: ${message}`);
    process.exitCode = 1;
  }
};

void seedExperiences();
