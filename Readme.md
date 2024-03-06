# Propacity backend assignment

The codebase has been divided into 4 modules: Routers, Controllers,Middlewares and queries.
In routers folder I have created router for the three components as mentioned in the assignment, userRouter which consists of routes for login and signup, folderRouter which consists routes to create a new folder and a subfolder, and the fileRouter which has routes for uploading and Managing the files.

Controllers consists of all the logic to implement the APIs as mentioned in the assignment.

Middlewares consists the logic to authenticate the user to check weather a user has the priviledge to use a particular folder or a file.

Queries consists of all the queries that are used for all the CRUD operation by the controllers.

The database scheme is as follows:

I have 4 tables: User(email,password), folder(owner,folderName), subfolder(owner,subfolder_name,parent_folder), files(fileID,owner,folder_name,file_name,file_size,upload_data)

To run the code,
1) Download the repositary
2) Create a psql database and create all the tables using the given schema.
3) Create .env file and mention all the psql details and aws credentials in this format

DB_USER=''
DB_HOST=''
DB_DATABASE=''
DB_PASSWORD=''
DB_PORT=''
SECRET_KEY=''
AWS_ACCESS_KEY_ID=''
AWS_SECRET_ACCESS_KEY=''

4) npm init
5) node/nodemon index.js


