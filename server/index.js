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
    origin: process.env.WEB_BASE_URL || "http://localhost:5173",
    credentials: true,
})
);

app.get("/", (req, res) => {
res.json({ message: "NexaHome backend API đang hoạt động!" });
});
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
console.log(`Server đang chạy tại http://localhost:${PORT}`);
});