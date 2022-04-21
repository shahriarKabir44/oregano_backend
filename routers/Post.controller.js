let PostController = require('express').Router()
const Post = require('../schemas/post')
const Tags = require('../schemas/tags')
const multer = require('multer');
const fs = require('fs')
const path = require('path');
const AvailableItem = require('../schemas/availableItem');

const upload = multer()

PostController.post('/upload', upload.array(), (req, res) => {
    let { postid, postedby, postedon, type, filename } = req.headers
    let dir = path.join(__dirname, '..', `static/upload/${postedby}/${postedon}`)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFile(`${dir}/${filename}.${type}`, req.body.file.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/jpg;base64,/, "").replace(/^data:image\/png;base64,/, ""), 'base64', function (err) {
        if (err) console.log(err);
        res.send({ data: `http://192.168.43.90:3000/upload/${postedby}/${postedon}/${filename}.${type}` });

    });
    //res.send({ data: "test" })
})

PostController.post('/updateTags', (req, res) => {
    AvailableItem.findOneAndDelete({
        $and: [
            { userId: req.body.userId },
            { day: req.body.day }
        ]
    }).then((rws) => {
        let newData = new AvailableItem({
            ...req.body,
            rating: 0,
            ratedBy: 0
        })
        newData.save()
            .then(data => {
                res.send({ data: 1 })
            })
    })

})

PostController.post('/getTagsOfToday', (req, res) => {
    AvailableItem.find({
        $and: [
            { userId: req.body.userId },
            { day: { $gte: req.body.day } }
        ]
    }).then(items => {
        res.send({ data: items })
    })
})

PostController.post('/updatePostImages', (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, { images: req.body.images })
        .then(data => {
            res.send({ data: 1 })
        })
})

PostController.post('/createPost', async (req, res) => {
    let newPost = new Post(req.body)
    await newPost.save()
    let newPostId = newPost._id
    let tagList = JSON.parse(req.body.tags)
    for (let tag of tagList) {
        let newTag = new Tags({
            tagName: tag,
            postId: newPostId,
        })
        await newTag.save()
    }

    res.send({ data: newPost })
})


module.exports = PostController