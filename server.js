const express= require("express");
const http = require("http");
const cors = require("cors");
const gql = require("graphql-tag");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const signupHandler = require("./handlers/Signup.js");
const loginHundler = require("./handlers/Login.js");
const uploadImage = require("./handlers/upload.js");
const fs = require('fs');

dotenv.config({path: "variables.env"});


const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json({ limit: "50MB" }));
app.use(express.static('public'));

app.post("/Signup", signupHandler);
app.post('/uploadImages',uploadImage);
app.post('/login', loginHundler);

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
})