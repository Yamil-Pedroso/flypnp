import "../config/env";
import mongoose from "mongoose";
import connectDB from "../config/db";
import { Place } from "../models/Place";

import { trending } from "../data/trending";
import { beachFront } from "../data/beachFront";
import { iconicCities } from "../data/iconicCities";

const importData = async () => {
  try {
    await connectDB();

    await Place.deleteMany();

    const datasets = [...trending, ...beachFront, ...iconicCities];

    await Place.insertMany(datasets);

    console.log("Data imported");
    process.exit();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error: ${message}`);
    process.exit(1);
  }
};

importData();
