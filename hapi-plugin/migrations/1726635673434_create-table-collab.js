'use strict';

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('notes_collabs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    note_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true
    }
  });

  pgm.addConstraint(
    'notes_collabs',
    'unique_note_id_and_user_id',
    'UNIQUE(note_id, user_id)'
  );

  pgm.addConstraint(
    'notes_collabs',
    'fk_notes_collabs.note_id_notes.id',
    'FOREIGN KEY(note_id) REFERENCES notes(id) ON DELETE CASCADE'
  );

  pgm.addConstraint(
    'notes_collabs',
    'fk_notes_collabs.user_id_notes_users.id',
    'FOREIGN KEY(user_id) REFERENCES notes_users(id) ON DELETE CASCADE'
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('notes_collabs');
};
