import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await client.connect();
      const db = client.db('sandwich-alignment');
      const collection = db.collection('sandwich-board-records');
      const result = await collection.insertOne({ ...req.body, createdAt: new Date() });
      res.status(200).json({ insertedId: result.insertedId });
    } catch (error) {
      console.error('Error inserting board state:', error);
      res.status(500).json({ error: 'Failed to insert board state' });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
