const insertUserQuery = `
  INSERT INTO users (email, password)
  VALUES ($1, $2)
  RETURNING *;
`;

module.exports = insertUserQuery;
