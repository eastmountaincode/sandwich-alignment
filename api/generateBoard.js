import OpenAI from "openai";
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
            content: "You are an expert in generating synthetic data. Return a JSON object with sandwichesOnBoard (array of objects with id, x, y), axisLabels (top: 'Good', bottom: 'Evil', left: 'Lawful', right: 'Chaotic'), note ('AI Generated Board'), and source ('ai-generated')."
          },
          {
            role: "user",
            content: `Generate board data using sandwich IDs from this list: ${sandwichData.sandwiches.map(s => s.id).join(', ')}`
          }
        ],
        // response_format: { type: "json_object" }
      });

      return res.status(200).json(completion.choices[0].message.content);
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
