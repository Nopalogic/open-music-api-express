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
  pgm.createTable("playlist_song_activities", {
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
    user_id: {
      type: "TEXT",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    action: {
      type: "TEXT",
      notNull: true,
    },
    time: {
      type: "TEXT",
      notNull: true,
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
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("playlist_song_activities");
};
