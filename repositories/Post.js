const postSchema = require('../schemas/post')

module.exports = class Post {
    constructor() {
        this.postSchema = postSchema
    }
    async getPosts(query) {
        return await this.postSchema.find(query)
    }
    async createPost(data) {
        let newPost = new this.postSchema(data)
        await newPost.save()
        return newPost['_doc']

    }
    async findOne(query) {
        return await this.postSchema.findOne(query)

    }

}