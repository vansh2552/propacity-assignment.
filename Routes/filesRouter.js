const { Router } = require("express");
const router = Router();
const authenticateToken = require("../Middlewares/auth")
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const AWS = require('aws-sdk');
const {createFile, renameFile, moveFile, deleteFile} = require("../Controllers/fileController")


router.post('/upload-file',authenticateToken, upload.single('file'),createFile);
router.put('/rename/:fileId', authenticateToken, renameFile)
router.put('/move/:fileId', authenticateToken, moveFile)
router.put('/delete/:fileId', authenticateToken,deleteFile)


module.exports = router