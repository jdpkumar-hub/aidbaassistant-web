import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sql = body.sql;

    if (!sql?.trim()) {
      return NextResponse.json(
        { error: "SQL statement required" },
        { status: 400 }
      );
    }

    const response = await client.chat.completions.create({
      model: "gpt-5",
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: `
You are a Senior Oracle SQL Tuning Expert.

Return ONLY valid JSON.

Format:

{
  "sql_health_score": 0,
  "risk_level": "",
  "root_cause": "",
  "business_impact": "",
  "issues": [],
  "optimized_sql": "",
  "index_recommendations": [],
  "estimated_gain": ""
}
`,
        },
        {
          role: "user",
          content: sql,
        },
      ],
    });

    const content =
      response.choices[0].message.content || "{}";

    console.log("GPT RESPONSE:");
    console.log(content);

    return NextResponse.json(
      JSON.parse(content)
    );

  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      {
        risk_level: "Unknown",
        issues: [error.message],
        optimized_sql: "",
        index_recommendations: [],
        estimated_gain: "N/A",
      },
      { status: 500 }
    );
  }
}