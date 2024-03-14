const insertSubFolder = `INSERT INTO subfolders (owner,parent_folder, subfolder_name) VALUES ($1, $2, $3) RETURNING *`;
module.exports = insertSubFolder;