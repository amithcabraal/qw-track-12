export interface SpotifyPlaylist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: {
    total: number;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
}

export interface SpotifyUser {
  display_name: string;
  images: { url: string }[];
}