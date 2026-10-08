const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const connectDB = require("./config/db");

const app = express();


// ================= DATABASE CONNECTION =================

connectDB();


// ================= MIDDLEWARE =================

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


// ================= STATIC FILES =================

// Serve files from src/public
app.use(express.static(path.join(__dirname, "public")));


// ================= API ROUTES =================

const routes = require("./routes");

app.use("/api", routes);


// ================= HOME PAGE =================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


// ================= TEST ROUTE =================

app.get("/ping", (req, res) => {
    res.send("pong");
});


// ================= START SERVER =================

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});