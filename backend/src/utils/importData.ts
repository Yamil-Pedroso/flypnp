import "../config/env";
import mongoose from "mongoose";
import connectDB from "../config/db";
import { Place } from "../models/Place";

import { trending } from "../data/trending";
import { beachFront } from "../data/beachFront";
import { iconicCities } from "../data/iconicCities";
import { tinyHomes } from "../data/tinyHomes";
import { mansions } from "../data/mansions";
import { cabins } from "../data/cabins";
import { skiing } from "../data/skiing";
import { design } from "../data/design";
import { tropical } from "../data/tropical";
import { castles } from "../data/castles";
import { surfing } from "../data/surfing";
import { caves } from "../data/caves";
import { camping } from "../data/camping";
import { luxe } from "../data/luxe";
const importData = async () => {
  try {
    await connectDB();

    await Place.deleteMany();

    const datasets = [
      ...trending,
      ...beachFront,
      ...iconicCities,
      ...tinyHomes,
      ...mansions,
      ...cabins,
      ...skiing,
      ...design,
      ...tropical,
      ...castles,
      ...surfing,
      ...caves,
      ...camping,
      ...luxe,
    ];

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
