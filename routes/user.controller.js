const userController=require('express').Router()

const User=require('../repositories/User')
let user=new User()

userController.post('/addNew',(req,res)=>{
    console.log(req.body)
    user.createUser(req.body).then(data=>{
        res.send({response: data})
    })
})

module.exports=userController