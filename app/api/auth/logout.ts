




// app/api/auth/logout.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
  res.status(200).json({ message: 'Logged out successfully' });
}