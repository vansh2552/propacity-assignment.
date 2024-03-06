const database = require("../database")

async function createFolder(req,res){
    const { folderName } = req.body;
    const email = req.user.email;

    try{
        const check = await database.query('SELECT * FROM folders WHERE name = $1', [folderName]);
        if(check.rows.length > 0){
            res.status(400).json({ success: false, message: 'Folder already exists' });
            return;
        }
        const result = await database.query('INSERT INTO folders (owner, name) VALUES ($1, $2) RETURNING *', [email, folderName]);
        res.json({ success: true, folder: result.rows[0] });
        

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Can not run the query' });
    }
}

async function createSubfolder(req,res){
    const { subfolderName, parentFolderName } = req.body;
    const user = req.user.email; // Extracted from the token during authentication

  
    try {
      // Check if the user has permission to create a subfolder in the specified parent folder
      const permissionCheckResult = await database.query('SELECT * FROM folders WHERE name = $1 AND owner = $2', [parentFolderName, user]);
  
      if (permissionCheckResult.rows.length === 0) {
        res.status(403).json({ success: false, message: 'You do not have permission to create a subfolder in the specified parent folder' });
        return;
      }
  
      // Check if the subfolder name is unique within the parent folder
      const checkResult = await database.query('SELECT * FROM subfolders WHERE parent_folder = $1 AND subfolder_name = $2', [parentFolderName, subfolderName]);
  
      if (checkResult.rows.length > 0) {
        res.status(400).json({ success: false, message: 'Subfolder name must be unique within the parent folder' });
        return;
      }
  
      // Insert subfolder into the database
      const result = await database.query('INSERT INTO subfolders (owner,parent_folder, subfolder_name) VALUES ($1, $2, $3) RETURNING *', [user,parentFolderName, subfolderName]);
      res.json({ success: true, subfolder: result.rows[0] });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error with query' });
    }
}

module.exports = {createFolder,createSubfolder}



