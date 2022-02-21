const userSchema=require('../schemas/user')
module.exports= class User{
    constructor(){
        this.userSchema=userSchema
    }
    async findOne(query){
        return await this.userSchema.findOne(query)
    }
    async createUser(data){
        let newUser=new this.userSchema(data)
        await newUser.save()
        return {data: newUser['_doc']}
    }
}