import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";

type Video = {
  Url: string;
};
type ResponseData = {
  rows?: any[];
  message?: string;
  metadata?: any;
  audioBuffer?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  /*   const db = database.init(); */
  if (req.method === "GET") {
    /* database.createTable(db); */
    const videos = await sql`SELECT * FROM videos ORDER BY ID DESC LIMIT 1`;
    res.status(200).json({ rows: videos.rows });
  }
  if (req.method === "POST") {
    const { url } = req.body;
    const ffmpeg = require("fluent-ffmpeg");
    let videoData;
    try {
      ffmpeg(url).ffprobe((err, metadata) => {
        if (err) {
          console.error("Error: " + err);
          return;
        }
        videoData = metadata;

        // Continue with the rest of the ffmpeg operations
        ffmpeg(url)
          .inputOptions("-ss 0")
          .screenshots({
            count: 1,
            folder: "./public",
            filename: "thumbnail.jpg",
          })
          .on("end", () => {
            console.log("Screenshots taken successfully");
          })
          .on("error", (err) => {
            console.error("Error:", err);
          })
          .seekInput(30) // Start at 30 seconds
          .duration(15) // Extract 15 seconds of audio
          .toFormat("wav") // Convert to WAV format
          .output("./public/audio.wav")
          .on("end", async function () {
            console.log("Extraction finished");
            try {
              await sql.query(`INSERT INTO videos (url) VALUES ('${url}');`);
              res.status(200).json({ metadata: videoData });
            } catch (error) {
              return res
                .status(500)
                .json({ message: "Could not insert video into database." });
            }
          })
          .on("error", function (err) {
            console.error("Error:", err);
          })
          .run();
      });
    } catch (e) {
      console.error("Error: " + e);
      res.status(500).send({ message: "Could not infer video metada." });
    }
  }
}
