const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require("./Routes/userRouter")
const folderRouter = require("./Routes/folderRouter")
const fileRouter = require("./Routes/filesRouter")
const app = express();
app.use(bodyParser.json());

app.use("/user",userRouter)
app.use("/folder",folderRouter)
app.use("/file",fileRouter)

app.listen(3000,() => {
    console.log("app running on port 3000");
})