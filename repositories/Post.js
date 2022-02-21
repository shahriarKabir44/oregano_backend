const postSchema=require('../schemas/post')

module.exports= class Post{
    constructor(){
        this.postSchema=postSchema
    }
    async getPosts(query){
        return await this.postSchema.find(query)
    }
    async createPost(data){
        let newPost=new this.postSchema(data)
        await newPost.save()
        return {
            data: newPost['_doc']
        }
    }
}