import { nanoid } from "nanoid";
import { Pool } from "pg";

import { Exception } from "../exceptions/error-handler.js";
import { validate } from "../validations/index.js";
import { PlaylistSchema } from "../validations/playlist.js";

export class PlaylistService {
  static pool = new Pool();

  static async createPlaylist(request) {
    const validatedRequest = validate(PlaylistSchema.create, request);

    const id = nanoid(16);
    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, validatedRequest.name, validatedRequest.owner],
    };

    const { rows, rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(400, "Failed to add playlist");
    }

    return { playlistId: rows[0].id };
  }

  static async getPlaylists(id) {
    const { playlistId } = validate(PlaylistSchema.get, {
      playlistId: id,
    });

    const query = {
      text: `
        SELECT playlists.id, playlists.name, users.username
        FROM playlists
        JOIN users ON users.id = playlists.owner
        WHERE playlists.owner = $1

        UNION

        SELECT playlists.id, playlists.name, users.username
        FROM collaborations
        JOIN playlists ON collaborations.playlist_id = playlists.id
        JOIN users ON users.id = playlists.owner
        WHERE collaborations.user_id = $1;`,
      values: [playlistId],
    };

    const { rows } = await this.pool.query(query);

    return { playlists: rows };
  }

  static async addSongToPlaylist(request) {
    const { playlistId, songId, userId } = validate(
      PlaylistSchema.addSong,
      request,
    );

    const { rowCount: checkSongId } = await this.pool.query({
      text: "SELECT * FROM songs WHERE id = $1",
      values: [songId],
    });

    if (!checkSongId) {
      throw new Exception(404, `Song with ID ${songId} not found`);
    }

    const { rowCount: checkAccess } = await this.pool.query({
      text: `
    SELECT 1 FROM playlists 
    WHERE id = $1 AND owner = $2
    UNION
    SELECT 1 FROM collaborations 
    WHERE playlist_id = $1 AND user_id = $2
  `,
      values: [playlistId, userId],
    });

    if (!checkAccess) {
      throw new Exception(403, "You don't have access to this playlist");
    }

    const id = nanoid(16);
    const query = {
      text: "INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(400, "Failed to add the song to the playlist");
    }
  }

  static async getSongByIdPlaylist(playlistId, userId) {
    await this.verifyPlaylistAccess(playlistId, userId);

    const query = {
      text: `
      SELECT playlists.id, playlists.name, users.username,
            songs.id AS song_id, songs.title, songs.performer
      FROM playlists
      JOIN users ON users.id = playlists.owner
      LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
      LEFT JOIN songs ON songs.id = playlist_songs.song_id
      WHERE playlists.id = $1
    `,
      values: [playlistId],
    };

    const { rows, rowCount } = await this.pool.query(query);

    if (!rowCount)
      throw new Exception(404, "Failed to fetch songs from this playlist");

    const songs = rows
      .filter((row) => row.song_id)
      .map((row) => ({
        id: row.song_id,
        title: row.title,
        performer: row.performer,
      }));

    return {
      playlist: {
        id: rows[0].id,
        name: rows[0].name,
        username: rows[0].username,
        songs,
      },
    };
  }

  static async deleteSongByIdPlaylist(request) {
    const { songId, playlistId, userId } = validate(
      PlaylistSchema.removeSong,
      request,
    );

    await this.verifyPlaylistAccess(playlistId, userId);

    const query = {
      text: "DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2 RETURNING id",
      values: [songId, playlistId],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount)
      throw new Exception(400, "No song was deleted from the playlist");
  }

  static async deletePlaylist(request) {
    const { playlistId, userId } = validate(PlaylistSchema.get, request);

    const { rowCount: playlistExist, rows: playlist } = await this.pool.query({
      text: "SELECT owner FROM playlists WHERE id = $1",
      values: [playlistId],
    });

    if (!playlistExist) {
      throw new Exception(404, `Playlist with ID ${playlistId} not found`);
    }

    if (playlist[0].owner !== userId) {
      throw new Exception(
        403,
        "You don't have permission to access this playlist",
      );
    }

    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [playlistId],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(
        400,
        `No playlist found with ID ${playlistId}, nothing deleted`,
      );
    }
  }

  static async verifyPlaylistAccess(playlistId, userId) {
    try {
      const { rowCount: playlistExist, rows: playlist } = await this.pool.query(
        {
          text: "SELECT owner FROM playlists WHERE id = $1",
          values: [playlistId],
        },
      );

      if (!playlistExist) {
        throw new Exception(404, `Playlist with ID ${playlistId} not found`);
      }

      if (playlist[0].owner !== userId) {
        throw new Exception(
          403,
          "You don't have permission to access this playlist",
        );
      }
    } catch (error) {
      if (error.status === 403) {
        const { rowCount: playlistCollab } = await this.pool.query({
          text: "SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
          values: [playlistId, userId],
        });

        if (!playlistCollab) {
          throw new Exception(
            403,
            "You don't have permission to access this playlist",
          );
        }
      } else {
        throw error;
      }
    }
  }
}
