import { google } from 'googleapis';

export default async function handler(req:any, res:any) {
  const { playlistId, maxResults = 5, pageToken } = req.query;

  if (!playlistId) {
    return res.status(400).json({ error: 'Playlist ID is required' });
  }

  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY, // Add your YouTube Data API v3 key in an environment variable
  });

  try {
    const response = await youtube.playlistItems.list({
      part: ['snippet'],
      playlistId,
      maxResults: parseInt(maxResults, 10),
      pageToken,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching playlist images:', error);
    res.status(500).json({ error: 'Failed to fetch playlist images' });
  }
}
