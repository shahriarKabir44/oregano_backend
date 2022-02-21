const postController=require('express').Router()

let Post=require('../repositories/Post')
let post=new Post()

postController.post('/createNew',(req,res)=>{
    post.createPost(req.body).then(data=>{
        res.send({response: data})
    })
})

module.exports=postController