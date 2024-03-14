const checkPermissionQuery = `SELECT * FROM folders WHERE name = $1 AND owner = $2`;
module.exports = checkPermissionQuery;