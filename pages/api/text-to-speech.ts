import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

type ResponseData = {
  message?: string;
};

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });
  const speechFile = path.resolve("public/speech.mp3");
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: req.body.text,
  });
  console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);

  res.status(200).json({ message: "Success" });
}
