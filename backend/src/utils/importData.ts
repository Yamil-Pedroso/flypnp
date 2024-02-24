import mongoose from "mongoose";
import connectDB from "../config/db";
import colors from "colors";
import dotenv from "dotenv";
import path from "path";
import { Place } from "../models/Place";

import { trending } from "../data/trending";
import { beachFront } from "../data/beachFront";
import { iconicCities } from "../data/iconicCities";

colors.enable();

dotenv.config({ path: path.resolve(__dirname, '..', 'config', 'config.env') });

const importData = async () => {
    try {
        await connectDB();

        await Place.deleteMany();

        const datasets = [...trending, ...beachFront, ...iconicCities];

        await Place.insertMany(datasets);

        console.log("Data Imported...".green.inverse);
        process.exit();
    } catch (error: any) {
        console.error(`Error: ${error.message}`.red.inverse);
        process.exit(1);
    }
};

importData();
