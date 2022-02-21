const userSchema=require('../schemas/user')
module.exports= class User{
    constructor(){
        this.userSchema=userSchema
    }
    async findOne(query){
        return await this.userSchema.findOne(userSchema)
    }
}