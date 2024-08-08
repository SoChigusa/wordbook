import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), 'data', 'words.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const words = JSON.parse(jsonData);
  res.status(200).json(words);
}