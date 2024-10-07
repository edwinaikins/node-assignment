const express = require('express');

const app = express();
app.use(express.json());
const port = 3002;
const blogs = [];

app.use((req,res,next)=>{
    console.log(req.method);
    console.log(req.url);
    next();
})

app.post("/posts",(req,res)=>{
    const {title, content, author} = req.body;
    let post = {
        id: blogs.length + 1,
        title,
        content,
        author,
    }
    blogs.push(post)
    res.send("Post sucessfully created")
})

app.get("/posts", (req,res)=>{
    if(blogs.length > 0){
        res.json(blogs)
    }else{
        res.json([])
    }
})

app.get("/posts/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    const blog = blogs.find((blog)=> blog.id === id)
    if(blog){
        res.json(blog)
    }else{
        res.status(404).send("blog not found")
    }
})

app.put("/posts/:id", (req,res)=>{
    const id = parseInt(req.params.id);
    const blog = blogs.find((blog)=> blog.id === id)
    const {title,content,author} = req.body;
    if(blog){
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.author = author || blog.author;
        res.json(blog);
    }else{
        res.status(404).send("no blog to edit");
    }
})

app.delete("/posts/:id", (req,res)=>{
    const id = parseInt(req.params.id);
    const blogIndex = blogs.findIndex((blog)=> blog.id === id)
    if(blogIndex !== -1){
        blogs.splice(blogIndex,1);
        res.json(blogs)
    }else{
        res.status(404).send("blog does not exist")
    }
})

app.listen(port,()=>{
    console.log(`Server started listening on port:${port}`)
})