const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Router } = require("express");
const router = Router();

const database = require("../database")

const insertUserQuery = require("../queries/insertUser")
const userExists = require("../queries/userExists")
const secret_key = process.env.SECRET_KEY

const {registerUser,loginUser} = require("../Controllers/userControllers")

router.post('/register',registerUser)
router.post('/login',loginUser)





module.exports = router