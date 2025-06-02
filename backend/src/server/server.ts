import express from "express";
import { Request, Response } from "express";
import chalk from "chalk";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import helmet from "helmet";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "../config/db";
import fileUpload from "express-fileupload";
import multer from "multer";

//console.log(chalk.blue('Hello, world!'));
//dotenv.config({ path: path.join(__dirname, '..', 'config', 'config.env') });
dotenv.config({ path: path.resolve(__dirname, "..", "config", "config.env") });

//console.log("Hello, world!".green); // Texto en verde
//console.log("Hello, world!".underline.red);
//console.log(process.env.CLOUD_NAME);
//const log = console.log;

// Combine styled and normal strings
//log(chalk.blue('Hello') + ' World' + chalk.red('!'));

const PORT = process.env.PORT || 8080;
connectDB();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

colors.enable();

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());

// Handle cookies
app.use(cookieParser());
const cookieTime = process.env.COOKIE_TIME as any;
const cookieSecret = process.env.COOKIE_SECRET as any;
app.use(
  cookieSession({
    name: "session",
    maxAge: cookieTime * 24 * 60 * 60 * 1000,
    keys: [cookieSecret],
    secure: true, // Only send over HTTPS
    sameSite: "none", // Allow cross-origin requests
    httpOnly: true, // Makes the cookie accessible only on the server-side
  })
);

// Routes
import routes from "../routes/index";

app.use("/api/v1", routes);

app.use(express.static(path.join(__dirname, "../../", "public")));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../", "public", "index.html"));
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World we have been just init with Node and Typescript!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`.green.bold);
});
