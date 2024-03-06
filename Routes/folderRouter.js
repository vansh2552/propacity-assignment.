const { Router } = require("express");
const router = Router();
const database = require("../database")
const authenticateToken = require("../Middlewares/auth")

const {createFolder,createSubfolder} = require("../Controllers/folderController")

router.post('/', authenticateToken, createFolder)
router.post('/subfolder', authenticateToken, createSubfolder)



module.exports = router