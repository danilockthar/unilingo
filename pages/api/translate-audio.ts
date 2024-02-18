import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import OpenAI from "openai";

type ResponseData = {
  transcription?: OpenAI.Audio.Transcriptions.Transcription;
  message?: string;
};

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream("public/audio.wav"),
    model: "whisper-1",
    language: "es",
  });

  res.status(200).json({ transcription });
}
