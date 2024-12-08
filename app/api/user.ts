import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { githubId } = req.query;

  if (!githubId) {
    res.status(400).json({ error: 'User ID missing' });
    return;
  }

  try {
    await client.connect();
    const db = client.db('oauth-app');
    const user = await db.collection('users').findOne({ githubId: parseInt(githubId as string) });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
