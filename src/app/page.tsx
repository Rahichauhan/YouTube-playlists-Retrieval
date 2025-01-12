'use client';

import { useState } from 'react';

interface PlaylistItem {
  id: string;
  snippet: {
    title: string;
    description: string;
  };
  contentDetails: {
    playlistId: string;
  };
}

interface PlaylistResponse {
  items: PlaylistItem[];
}

const YOUTUBE_PLAYLIST_ITEMS_API = "https://www.googleapis.com/youtube/v3/playlists";

export default function Page() {
  const [channelId, setChannelId] = useState('');
  const [data, setData] = useState<PlaylistResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPlaylist = async () => {
    if (!channelId) {
      setError('Please enter a valid channel ID.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet%2CcontentDetails&channelId=${channelId}&maxResults=25&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`,
        { cache: 'no-store' }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch YouTube API: ${res.status} ${res.statusText}`);
      }

      const playlistData: PlaylistResponse = await res.json();
      setData(playlistData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">YouTube Playlist Viewer</h1>

      <div className="mb-6">
        <input
          type="text"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          placeholder="Enter Channel ID"
          className="border border-gray-300 p-2 rounded w-full"
        />
        <button
          onClick={fetchPlaylist}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full hover:bg-blue-600"
        >
          Fetch Playlist
        </button>
      </div>

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {error && <p className="text-center text-red-500">{error}</p>}

      {data && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Playlist</h2>
          {data.items.map((item) => (
            <div
              key={item.id}
              className="border border-gray-300 rounded-lg shadow-md p-4 mb-4"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {item.snippet.title}
              </h3>
              <p className="text-gray-600">{item.snippet.description}</p>

              <a
                href={`https://www.youtube.com/playlist?list=${item.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-2 block"
              >
                View on YouTube
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
