require("dotenv").config();
const express = require("express");
const Replicate = require("replicate");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(
  express.json({
    limit: "50mb",
  })
);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.get("/api/convert", (req, res) => {
  res.send("Send post requests to get conversions");
});

app.post("/api/convert", async (req, res) => {
  const replicateApiToken = process.env.SERVER_REPLICATE_API_TOKEN;
  console.log(req.body);
  try {
    // console.log(req.body.image_url);
    const replicate = new Replicate({
      auth: replicateApiToken,
    });

    const output = await replicate.run(
      "lucataco/xtts-v2:684bc3855b37866c0c65add2ff39c78f3dea3f4ff103a436465326e0f438d55e",
      {
        input: {
          text: req.body.text,
          speaker: req.body.speaker,
          language: "en",
          cleanup_voice: true,
        },
      }
    );
    res.json({ result: output });
  } catch (error) {
    console.error("Error:", error);
    res.json({ error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
