/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("playlist_songs", {
    id: {
      type: "TEXT",
      primaryKey: true,
    },
    playlist_id: {
      type: "TEXT",
      notNull: true,
      references: '"playlists"',
      onDelete: "CASCADE",
    },
    song_id: {
      type: "TEXT",
      notNull: true,
      references: '"songs"',
      onDelete: "CASCADE",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.addConstraint("playlist_songs", "unique_playlist_song", {
    unique: ["playlist_id", "song_id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("playlist_songs");
};
