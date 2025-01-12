"use client";
import { useState } from "react";

const PlaylistImages = () => {
  const [playlistId, setPlaylistId] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null); // Explicitly type the error state

  const fetchPlaylistImages = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/getPlaylistImage?playlistId=${playlistId}`);
      const data = await response.json();

      if (response.ok) {
        setImages(data.items || []);
      } else {
        setError(data.error || "Failed to fetch images");
      }
    } catch (err) {
      setError("An error occurred while fetching images");
      console.error(err);
    }
  };

  return (
    <div>
      <h1>YouTube Playlist Images</h1>
      <input
        type="text"
        placeholder="Enter Playlist ID"
        value={playlistId}
        onChange={(e) => setPlaylistId(e.target.value)}
      />
      <button onClick={fetchPlaylistImages}>Fetch Images</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {images.map((item, index) => (
          <div key={index}>
            <img
              src={item.snippet.thumbnails.default.url}
              alt={item.snippet.title}
              style={{ margin: "10px", borderRadius: "5px" }}
            />
            <p>{item.snippet.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistImages;
