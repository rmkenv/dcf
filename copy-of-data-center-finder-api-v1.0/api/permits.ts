
import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { key } = req.query;
  const masterKey = process.env.VALID_API_KEY || 'demo_key_123';
  
  if (!key || key !== masterKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'A valid API key is required.',
      docs: '/api-portal'
    });
  }

  try {
    const filePath = path.join((process as any).cwd(), 'latest_permits.json');
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 'error',
        message: 'Sync data file (latest_permits.json) not found in deployment. Ensure GitHub Action has run and pushed the file.',
      });
    }

    const fileData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileData);

    res.status(200).json({
      status: 'success',
      ...data
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while reading permit data.',
    });
  }
}
