import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BoardSchema = z.object({
  sandwichesOnBoard: z.array(z.object({
    id: z.string(),
    x: z.number(),
    y: z.number()
  })),
  axisLabels: z.object({
    top: z.string(),
    bottom: z.string(),
    left: z.string(),
    right: z.string()
  }),
  note: z.string(" "),
  source: z.literal("ai-generated")
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const sandwichData = JSON.parse(
      readFileSync(join(__dirname, '../src/data/sandwiches.json'), 'utf8')
    );

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant."
          },
          {
            role: "user",
            content: "Say hello!"
          }
        ]
      });

      return res.status(200).json({
        message: completion.choices[0].message.content,
        sandwichIds: sandwichData.sandwiches.map(s => s.id)
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } catch (error) {
    return res.status(500).json({ 
      error: error.message,
      path: join(__dirname, '../src/data/sandwiches.json')
    });
  }
}
