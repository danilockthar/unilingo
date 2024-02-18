import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { ocrSpace } from "ocr-space-api-wrapper";

type ResponseData = {
  message?: string;
  text?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const response = await ocrSpace("public/thumbnail.jpg", {
      apiKey: process.env.OCR_API_KEY,
    });

    const text = response.ParsedResults[0].ParsedText;
    res.status(200).json({ text });
  } catch (error) {
    console.error(error);
  }
}
