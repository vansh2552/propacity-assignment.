const database = require("../database")
const authenticateToken = require("../Middlewares/auth")
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const AWS = require('aws-sdk');

async function createFile(req,res){
    const folderId = req.query.folderName; 
    const fileID = req.query.fileID;
    const userId = req.user.email; 
    const file = req.file; 
    
    try {
        // Check if the user has permission to upload a file to the specified folder
        const permissionCheckResult = await database.query('SELECT * FROM folders WHERE owner = $1 AND name = $2', [userId,folderId]);
    
        if (permissionCheckResult.rows.length === 0) {
          res.status(403).json({ success: false, message: 'You do not have permission to upload a file to the specified folder' });
          return;
        }

        const checkResult = await database.query('SELECT * FROM files WHERE fileid = $1', [fileID]);
        if (checkResult.rows.length > 0) {
            res.status(400).json({ success: false, message: 'File already exists' });
            return;
        }
    
        // Upload file to S3
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });

        const params = {
          Bucket: 'propacity-assignment', 
          Key: file.originalname,
          Body: file.buffer,
          ACL: 'public-read',
        };

        const s3 = new AWS.S3();
        s3.upload(params, function(err, data) {
          if (err) {
              throw err;
          }
          console.log(`File uploaded successfully. ${data.Location}`);
      });
        
    
        // Record file metadata in the database
        const result = await database.query(
          'INSERT INTO files (fileID,owner, folder_name, file_name, file_size, upload_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [fileID,userId, folderId, file.originalname, file.size, new Date()]
        );
    
        res.json({ success: true, file: result.rows[0] });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
}

async function renameFile(req,res){
    const { fileId } = req.params;
    const {newName} = req.body;
    const userId = req.user.email; // Extracted from the token during authentication

    try{
        const fileResult = await database.query('SELECT * FROM files WHERE fileid = $1 AND owner = $2', [fileId, userId]);
  
        if (fileResult.rows.length === 0) {
            res.status(404).json({ success: false, message: 'File not found or you do not have permission to manage this file' });
            return;
        }
        const file = fileResult.rows[0];
        const renameResult = await database.query('UPDATE files SET file_name = $1 WHERE fileid = $2 RETURNING *', [newName, fileId]);
        res.json({ success: true, message: 'File renamed successfully', file: renameResult.rows[0] });



    }catch(error){
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function moveFile(req,res){
    const { fileId } = req.params;
    const { newFolderId } = req.body;
    const userId = req.user.email; // Extracted from the token during authentication
    try{
        const fileResult = await database.query('SELECT * FROM files WHERE fileid = $1 AND owner = $2', [fileId, userId]);
  
        if (fileResult.rows.length === 0) {
            res.status(404).json({ success: false, message: 'File not found or you do not have permission to manage this file' });
            return;
        }
    
        const file = fileResult.rows[0];
        const folderCheckResult = await database.query('SELECT * FROM folders WHERE name = $1 AND owner = $2', [newFolderId, userId]);
    
            if (folderCheckResult.rows.length === 0) {
              res.status(403).json({ success: false, message: 'You do not have permission to move the file to the specified folder' });
              return;
            }
    
            // Move the file to a new folder
            const moveResult = await database.query('UPDATE files SET folder_name = $1 WHERE fileid = $2 RETURNING *', [newFolderId, fileId]);
            res.json({ success: true, message: 'File moved successfully', file: moveResult.rows[0] });
            


    }catch(error){
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    
    }

}

async function deleteFile(req,res){
    const { fileId } = req.params;
    const userId = req.user.email; // Extracted from the token during authentication
    try {
        // Retrieve file details
        const fileResult = await database.query('SELECT * FROM files WHERE fileid = $1 AND owner = $2', [fileId, userId]);
    
        if (fileResult.rows.length === 0) {
          res.status(404).json({ success: false, message: 'File not found or you do not have permission to manage this file' });
          return;
        }
    
        const file = fileResult.rows[0];

    }catch(error){
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
    await database.query('DELETE FROM files WHERE fileid = $1', [fileId]);
    res.json({ success: true, message: 'File deleted successfully' });
}

module.exports = {createFile,renameFile,moveFile,deleteFile}