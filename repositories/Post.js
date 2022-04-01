const postSchema = require('../schemas/post')

module.exports = class Post {
    constructor() {
        this.postSchema = postSchema
    }
    async getPosts(query) {
        return await this.postSchema.find(query).sort({ postedOn: -1 })
    }
    async createPost(data) {
        let newPost = new this.postSchema(data)
        await newPost.save()
        return newPost

    }
    async findOne(query) {
        return await this.postSchema.findOne(query)

    }
    async findLatest(ownerId) {
        return await this.postSchema.find({ postedBy: ownerId }).sort({ postedOn: -1 }).limit(1)
    }

}