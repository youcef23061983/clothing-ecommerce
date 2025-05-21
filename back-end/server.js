require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const cors = require("cors");
const morgan = require("morgan");
const productsRoutes = require("./routes/products.js");
const authRoutes = require("./routes/authUser.js");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend origin
    credentials: true, // Allow credentials (cookies)
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);
app.use(morgan("dev"));
app.use("/products", productsRoutes);
app.use("/auth", authRoutes);

app.use("/", async (req, res) => {
  res.send("Hello from the server");
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
