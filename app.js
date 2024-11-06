const express = require('express');
require('dotenv').config();
const Blog = require("./models/blogs");
const User = require("./models/users");
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const databaseConnect = async () =>{
    try{
        await mongoose.connect(process.env.uri)
        console.log("database connected succesfully")
        app.listen(port,()=>{
            console.log(`Server started listening on port:${port}`)
        })
    }
    catch(error){
        console.log(error)
    }
}


databaseConnect();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3002;

app.use((req,res,next)=>{
    console.log(req.method);
    console.log(req.url);
    next();
})

app.post("/posts",(req,res)=>{
    const blog = new Blog(req.body);
    blog.save()
    .then(() => res.send("Post successfully created"))
    .catch(error => {
            console.log(error);
            res.status(500).send("Error creating post");
        });
})

app.get("/posts", (req,res)=>{
    Blog.find()
        .then((result)=>{
            res.json(result)
        })
        .catch((error) =>{
            console.log(error)
            res.status(404).send("blog not found")
        })
})

app.get("/posts/:id",(req,res)=>{
    const id = req.params.id;
    Blog.findById(id)
        .then((result)=>{
            if(result){
                res.json(result)
            }
            else{
                res.status(404).send("no blog found")
            }
            
        })
        .catch(()=>{
            console.log(error)
            res.status(500).send("Error Occured")
        })
})

app.put("/posts/:id", (req,res)=>{
    const id = req.params.id;
    Blog.findByIdAndUpdate(id, req.body, {new: true})
        .then((result) =>{
            if(result){
                res.json(result)
            }
            else{
                res.status(404).send("Blog not found")
            }
        })
        .catch((error) =>{
            console.log(error)
            res.status(500).send("Error Occured")
        })
        res.status(404).send("no blog to edit");
})

app.delete("/posts/:id", (req,res)=>{
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then((result)=>{
            if(result) {
                res.send("Blog deleted")
            }
            else{
                res.status(404).send("Blog not found")
            }    
        })
        .catch((error) =>{
            console.log(error)
            res.status(500).send("Error occured")
        })
        
    
})

app.post("/register", async (req, res) =>{
    const { username, password} = req.body;
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password,saltRounds)
    try{
       await User.create({username,password: hashPassword});
       res.send("User registered successfully")
    }
    catch(error){
        console.log(error)
        res.status(500).send("Error creating user")
    }
})

app.post("/login", async(req, res) =>{
    const {username, password} = req.body;
    try{
        const user = await User.findOne({username:req.body.username})
        if(!user){
           return res.status(404).send("User not found")
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).send("password mismatch")
        }
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:"1h"})
        res.send({token})
    }
   catch(error){
    console.log(error);
    res.status(500).send(error)
   }

})


const authenicateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    console.log(authHeader)
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token)
    if(!token){
        return res.send("Invalid tokeeen")
    }
    jwt.verify(token, process.env.JWT_SECRET, (err,user) =>{
        if(err){
            return res.send("Invalid token")
        }
        console.log(user)
        req.user = user
        next()
    })
}

app.get("/protected", authenicateToken, (req, res) =>{
    res.status(200).send({msg:"success", user: req.user})
})