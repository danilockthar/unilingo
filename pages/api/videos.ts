import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../utils/database";

type Video = {
  id: number;
  url: string;
};
type ResponseData = {
  rows?: Video[];
  message?: string;
  metadata?: any;
  audioBuffer?: any;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const db = database.init();
  if (req.method === "GET") {
    database.createTable(db);

    db.all(
      "SELECT * FROM videos ORDER BY ID DESC LIMIT 1",
      (err, rows: Video[]) => {
        if (err) {
          console.error(err);
          res.status(500).send({ message: "Internal server error" });
        } else {
          res.status(200).json({ rows });
        }
      }
    );
  }
  if (req.method === "POST") {
    const { url } = req.body;
    const ffmpeg = require("fluent-ffmpeg");
    let videoData;
    console.log(url, "POST URL");
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
          .on("end", function () {
            console.log("Extraction finished");
            res.status(200).json({ metadata: videoData });
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
    /*  try {
      var process = new ffmpeg(url);
      console.log(process, "PROCESS")
      process.then(
        function (video) {
          // Video metadata
          console.log(video.metadata);
          // FFmpeg configuration
          console.log(video);
        },
        function (err) {
          console.log("Error: " + err);
        }
      );
    } catch (e) {
      console.log(e.code, 'CODE');
      console.log(e.msg);
    } */
  }
}
