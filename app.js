//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
const mysql = require("mysql2");
const bcrypt = require('bcryptjs');
const saltRounds = 10;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

const db = mysql.createConnection({
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,  
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB

})

db.connect((err)=>{
    if(err){
        console.log("Unable to connect to the database")
    }
    else{
        console.log("Connected to the database")
    }
})

function queryPromise(sql, values=[]){
    return new Promise((resolve , reject)=>{
        db.query(sql, values, (error, results)=>{
            if(error){
                reject(error);
                
            }
            else {
                resolve(results);
            }
        });
    })
}

app.post("/register", async (req,res)=>{
    try{
        const {username, password} = req.body;

        if(!username || !password){
            return res.status(400).json({error: "Username and password required"});
        }
        
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = [username, hashedPassword];
        const sql = "INSERT INTO users (username, password) Values (?,?)";
        
        const results = await queryPromise(sql, user);
        res.render("secrets");
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to create user"});
    }
    
})

app.post("/login", async(req, res) => {
    try {
        const {username, password} = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password required" });
        }

        // Add your query execution logic here
        const sql = 'SELECT * FROM users WHERE username = ?';
        // const user = [username,password];
        const results = await queryPromise(sql,[username]);

        if(results.length === 0){
            return res.status(401).json({error: "Invalid Username or Password"});
        }

        const storedHashedPassword = results[0].password;

        // Compare entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, storedHashedPassword);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid Username or Password" });
        }

        // If password matches, render the secrets page
        res.render("secrets");


    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to login user" });
    }
});

app.get("/", (req, res)=>{
    res.render("home");
})

app.get("/login", (req,res)=>{
    res.render("login");
})

app.get("/register", (req,res)=>{
    res.render("register");
})




app.listen(process.env.PORT, function(){
    console.log("server is up and running")
})