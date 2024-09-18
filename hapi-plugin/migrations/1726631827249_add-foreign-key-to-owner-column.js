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
  pgm.sql(`
    INSERT INTO notes_users(id, username, password, fullname)
    VALUES('user-OLD-NOTES', 'old_notes', 'old_notes', 'Old Notes')
  `);

  pgm.sql("UPDATE NOTES SET owner = 'old_notes' WHERE owner IS NULL");

  pgm.addConstraint(
    'notes',
    'fk_notes.owner_notes_users.id',
    'FOREIGN KEY(owner) REFERENCES notes_users(id) ON DELETE CASCADE'
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('notes', 'fk_notes.owner_users.id');

  pgm.sql("UPDATE notes SET owner = NULL WHERE owner = 'old_notes'");

  pgm.sql("DELETE FROM notes_users WHERE id = 'user-OLD-NOTES'");
};
