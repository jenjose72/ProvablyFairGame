const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/roll-dice", (req, res) => {
  const { bet } = req.body;

  if (!bet || bet <= 0) {
    return res.status(400).json({ error: "Invalid bet amount!" });
  }

  const roll = Math.floor(Math.random() * 6) + 1;
  const secret = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHash("sha256").update(`${roll}-${secret}`).digest("hex");

  res.json({ roll });
  
});

app.listen(5000, () => console.log("Server running on port 5000"));
