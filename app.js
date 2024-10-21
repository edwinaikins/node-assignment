const express = require('express');
require('dotenv').config();
const Blog = require("./models/blogs");
const mongoose = require("mongoose")

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