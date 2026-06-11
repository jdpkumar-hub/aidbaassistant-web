import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "user",
          content: "Reply with SUCCESS only",
        },
      ],
    });

    return NextResponse.json({
      result: response.choices[0].message.content,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    });
  }
}