const createFolderQuery = `INSERT INTO folders (owner, name) VALUES ($1, $2) RETURNING *`;
module.exports = createFolderQuery