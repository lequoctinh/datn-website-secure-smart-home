require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, 
})
);

// Route mặc định test
app.get("/", (req, res) => {
res.json({ message: "Secure Smart Home backend API đang hoạt động!" });
});

// Import routes
app.use("/api/auth", require("./routes/auth.routes"));

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Start server
app.listen(PORT, () => {
console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
