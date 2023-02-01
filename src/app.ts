// importing necessary modules

require("dotenv").config();
const express = require("express");
const connectDB = require("./utils/connectDB");
const session = require("express-session");
const cookieSession = require("cookie-session");
const cors = require("cors");
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload')
import { Express, Request, Response, NextFunction } from "express";

const passport = require("passport");
// server config
const app: Express = express();
require("./config/passportSetup.ts");

const PORT = process.env.PORT;
// database connection
connectDB();
const router = require("./routes/index.routes");

// middlewares
app.use(express.json());
app.use(bodyParser.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(
  cookieSession({
    name: "session",
    keys: ["rohan"],
    maxage: 24 * 60 * 60 * 100,
  })
);
app.use(fileUpload({useTempFiles: true}))

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
app.use("/api", router);

app.listen(PORT, () => console.log(`I am running at http://localhost:${PORT}`));
export default app;
