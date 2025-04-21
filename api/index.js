const express = require("express");
const serverless = require("serverless-http");
require("dotenv").config();

const cors = require("cors");
const cookieParser = require("cookie-parser");

const adminRoute = require("../src/routes/adminRoute");
const errorMiddleware = require("../src/middlewares/errorMiddleware");
const corsOptions = require("../src/middlewares/corsMiddleware");

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api", adminRoute);
app.use(errorMiddleware);

// export for Vercel
module.exports.handler = serverless(app);
