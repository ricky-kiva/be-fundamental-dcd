'use strict';

/* eslint-disable camelcase */

const mapDBNotesToModel = ({
  id,
  title,
  body,
  tags,
  created_at,
  updated_at
}) => ({
  id,
  title,
  body,
  tags,
  createdAt: created_at,
  updatedAt: updated_at
});

module.exports = { mapDBNotesToModel };
