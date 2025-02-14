import { MongoClient } from 'mongodb';
import fetch from 'node-fetch'; // Ensure you have node-fetch installed

const uri = process.env.MONGODB_URI;

async function fetchIpAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to fetch IP address:', error);
    return 'unknown';
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let client;
    try {
      const ipAddress = await fetchIpAddress();

      // Initialize and connect the MongoDB client
      client = new MongoClient(uri);
      await client.connect();

      const db = client.db('sandwich-alignment');
      const collection = db.collection('sandwich-board-records');

      // Insert the document
      const result = await collection.insertOne({ ...req.body, ipAddress, createdAt: new Date() });
      res.status(200).json({ insertedId: result.insertedId });

    } catch (error) {
      console.error('Error inserting board state:', error);
      res.status(500).json({ error: 'Failed to insert board state', details: error.message });
    } finally {
      if (client) {
        await client.close();
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
