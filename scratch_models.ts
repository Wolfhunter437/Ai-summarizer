import { readFileSync } from 'node:fs';

const envFile = readFileSync('.env.local', 'utf-8');
const keyMatch = envFile.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.+)/);
if (!keyMatch) {
  console.error("No API key found in .env.local");
  process.exit(1);
}
const key = keyMatch[1].trim();

async function getModels() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await res.json();
    console.log(data.models.map((m: any) => m.name).filter((n: string) => !n.includes('preview') && !n.includes('2.0') && !n.includes('1.5') && !n.includes('1.0') && n.includes('flash')));
  } catch (err) {
    console.error(err);
  }
}

getModels();
