require("dotenv").config();
const express = require("express");
const cors = require("cors");
const adminRoute = require("./src/routes/adminRoute");
const corsOptions = require("./src/middlewares/corsMiddleware");
const PORT = 5000;

const app = express();

//MiddleWare
app.use(express.json());
app.use(cors(corsOptions));



app.use("/api", adminRoute);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
