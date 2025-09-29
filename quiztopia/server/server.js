import express from "express";
import cors from "cors";
import fetch from 'node-fetch';

const app = express();
app.use(cors()); // allow your frontend domain
app.use(express.json());

app.post("/generate-questions", async (req, res) => {
  try {
    const response = await fetch(
      "https://kypfswyeviskcfkksekp.supabase.co/functions/v1/generate-questions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY, // secure, never expose to frontend
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log("Backend running on port 3001"));
