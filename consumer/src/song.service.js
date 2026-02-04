import { Pool } from "pg";

export class SongService {
  constructor() {
    this.pool = new Pool();
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `SELECT playlists.id AS playlist_id,playlists.name AS playlist_name, users.username,songs.id AS song_id, songs.title, songs.performer
      FROM playlists
      JOIN users ON playlists.owner = users.id
      LEFT JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id
      LEFT JOIN songs ON playlist_songs.song_id = songs.id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const result = await this.pool.query(query);
    return result.rows;
  }
}
